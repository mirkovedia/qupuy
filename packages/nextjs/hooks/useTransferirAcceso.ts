"use client";

import { useState } from "react";
import type { Address } from "viem";
import { isAddress } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

/**
 * Transferencia de una membresía a otra wallet.
 * La Key es un ERC-721: al transferirla, el remitente pierde el acceso.
 */
/**
 * Techo de gas para `transferFrom`.
 *
 * Una transferencia ERC-721 consume del orden de 100.000; el margen evita que
 * una estimación fallida dispare el límite por encima de lo que aceptan los
 * RPC públicos.
 */
const LIMITE_GAS_TRANSFERENCIA = 300_000n;

export const useTransferirAcceso = (lockAddress: Address | undefined, tokenId: bigint | undefined) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const transferir = async (destino: Address): Promise<boolean> => {
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
      const argumentos = {
        address: lockAddress,
        abi: PUBLIC_LOCK_ABI,
        functionName: "transferFrom",
        args: [address, destino, tokenId],
        account: address,
      } as const;

      // Simular antes de firmar: si el contrato va a rechazar la
      // transferencia, el usuario lo sabe sin gastar gas.
      await publicClient.simulateContract(argumentos);

      const hash = await writeContractAsync({
        ...argumentos,
        gas: LIMITE_GAS_TRANSFERENCIA,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      notification.success("Acceso pasado correctamente");
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
