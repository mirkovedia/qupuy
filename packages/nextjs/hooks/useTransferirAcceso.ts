"use client";

import { useState } from "react";
import type { Address } from "viem";
import { isAddress } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { type AllowedChainIds, getParsedError, notification } from "~~/utils/scaffold-eth";

/**
 * Techo de gas para mover una key.
 *
 * Una transferencia ERC-721 consume del orden de 100.000; el margen evita que
 * una estimación fallida dispare el límite por encima de lo que aceptan los
 * RPC públicos.
 */
export const LIMITE_GAS_TRANSFERENCIA = 300_000n;

/**
 * Cómo se entrega un acceso.
 *
 * - `regalar`: `transferFrom`. Definitivo; el receptor pasa a ser dueño pleno.
 * - `prestar`: `lendKey`. El receptor tiene el acceso, pero quien presta sigue
 *   siendo el key manager: el receptor no puede pasarlo a un tercero, y el
 *   préstamo se puede recuperar con `unlendKey`.
 *
 * En ambos casos quien entrega pierde el acceso: solo una persona lo tiene a la vez.
 */
export type ModoEntrega = "regalar" | "prestar";

export const useTransferirAcceso = (lockAddress: Address | undefined, tokenId: bigint | undefined) => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;
  const publicClient = usePublicClient({ chainId });
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const transferir = async (destino: Address, modo: ModoEntrega = "regalar"): Promise<boolean> => {
    if (!lockAddress || !address || tokenId === undefined) {
      notification.error("No tienes un acceso que puedas pasar");
      return false;
    }

    if (!isAddress(destino)) {
      notification.error("Esa dirección no es válida");
      return false;
    }

    if (destino.toLowerCase() === address.toLowerCase()) {
      notification.error("No puedes pasarte el acceso a ti mismo");
      return false;
    }

    if (!publicClient) {
      notification.error("No se pudo confirmar la transacción. Revisa tu conexión.");
      return false;
    }

    setIsPending(true);
    try {
      // `chainId` fija la red del Lock: si la wallet está en otra, wagmi
      // rechaza la firma en lugar de enviar la transacción donde esté.
      const comun = {
        address: lockAddress,
        abi: PUBLIC_LOCK_ABI,
        args: [address, destino, tokenId],
        account: address,
        chainId,
      } as const;

      // Simular antes de firmar: si el contrato va a rechazar la operación,
      // el usuario lo sabe sin gastar gas.
      let hash: `0x${string}`;
      if (modo === "prestar") {
        const argumentos = { ...comun, functionName: "lendKey" } as const;
        await publicClient.simulateContract(argumentos);
        hash = await writeContractAsync({ ...argumentos, gas: LIMITE_GAS_TRANSFERENCIA });
      } else {
        const argumentos = { ...comun, functionName: "transferFrom" } as const;
        await publicClient.simulateContract(argumentos);
        hash = await writeContractAsync({ ...argumentos, gas: LIMITE_GAS_TRANSFERENCIA });
      }

      const recibo = await publicClient.waitForTransactionReceipt({ hash });
      if (recibo.status !== "success") {
        notification.error("La transacción se minó pero el contrato la rechazó. Sigues teniendo el acceso.");
        return false;
      }

      notification.success(
        modo === "prestar" ? "Acceso prestado. Puedes recuperarlo cuando quieras" : "Acceso pasado correctamente",
      );
      return true;
    } catch (error) {
      notification.error(getParsedError(error));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { transferir, isPending };
};
