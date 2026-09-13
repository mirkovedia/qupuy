"use client";

import { useState } from "react";
import { LIMITE_GAS_TRANSFERENCIA } from "./useTransferirAcceso";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { BLOQUE_DESPLIEGUE, resolverLock } from "~~/contracts/unlock/locks";
import { PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { leerTransferencias } from "~~/services/web3/clienteEventos";
import { type AllowedChainIds, getParsedError, notification } from "~~/utils/scaffold-eth";

export type Prestamo = {
  tokenId: bigint;
  prestadoA: Address;
};

/**
 * Accesos de un curso que has prestado y puedes recuperar.
 *
 * Unlock no enumera las keys por key manager, así que se reconstruye desde la
 * cadena: los `Transfer` que salieron de tu wallet dan los tokenIds
 * candidatos, y `keyManagerOf` confirma cuáles siguen bajo tu control. Un
 * regalo pone el manager a cero; un préstamo te deja a ti.
 */
export const usePrestamos = (lockKey: string) => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;
  const lockAddress = resolverLock(lockKey, chainId);
  const publicClient = usePublicClient({ chainId });
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const { data: prestamos = [], isLoading } = useQuery({
    queryKey: ["prestamos", chainId, lockAddress, address],
    enabled: Boolean(lockAddress && address && publicClient),
    retry: 1,
    queryFn: async (): Promise<Prestamo[]> => {
      if (!lockAddress || !address || !publicClient) return [];
      try {
        const salidas = await leerTransferencias(lockAddress, BLOQUE_DESPLIEGUE, { from: address });

        const tokenIds = [...new Set(salidas.map(s => s.args.tokenId).filter((id): id is bigint => id !== undefined))];

        const detalles = await Promise.all(
          tokenIds.map(async tokenId => {
            const [manager, dueno] = await Promise.all([
              publicClient.readContract({
                address: lockAddress,
                abi: PUBLIC_LOCK_ABI,
                functionName: "keyManagerOf",
                args: [tokenId],
              }),
              publicClient.readContract({
                address: lockAddress,
                abi: PUBLIC_LOCK_ABI,
                functionName: "ownerOf",
                args: [tokenId],
              }),
            ]);
            return { tokenId, manager, dueno };
          }),
        );

        const yo = address.toLowerCase();
        return detalles
          .filter(d => d.manager.toLowerCase() === yo && d.dueno.toLowerCase() !== yo)
          .map(d => ({ tokenId: d.tokenId, prestadoA: d.dueno }));
      } catch (error) {
        console.error("No se pudieron leer los préstamos", error);
        throw error;
      }
    },
  });

  const recuperar = async (tokenId: bigint): Promise<boolean> => {
    if (!lockAddress || !address) {
      notification.error("Conecta tu wallet para recuperar el acceso");
      return false;
    }

    if (!publicClient) {
      notification.error("No se pudo confirmar la transacción. Revisa tu conexión.");
      return false;
    }

    setIsPending(true);
    try {
      const argumentos = {
        address: lockAddress,
        abi: PUBLIC_LOCK_ABI,
        functionName: "unlendKey",
        args: [address, tokenId],
        account: address,
        chainId,
      } as const;

      await publicClient.simulateContract(argumentos);
      const hash = await writeContractAsync({ ...argumentos, gas: LIMITE_GAS_TRANSFERENCIA });

      const recibo = await publicClient.waitForTransactionReceipt({ hash });
      if (recibo.status !== "success") {
        notification.error("La transacción se minó pero el contrato la rechazó. El préstamo sigue en pie.");
        return false;
      }

      notification.success("Tu acceso volvió contigo");
      void queryClient.invalidateQueries({ queryKey: ["prestamos", chainId, lockAddress] });
      void queryClient.invalidateQueries({ queryKey: ["readContract", { address: lockAddress }] });
      void queryClient.invalidateQueries({ queryKey: ["linaje", chainId, lockAddress] });
      return true;
    } catch (error) {
      notification.error(getParsedError(error));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { prestamos, isLoading, recuperar, isPending };
};
