"use client";

import { useState } from "react";
import type { Address } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { getParsedError, notification } from "~~/utils/scaffold-eth";

const DIRECCION_CERO = "0x0000000000000000000000000000000000000000" as Address;

/**
 * Techo de gas para `purchase`.
 *
 * Una compra en Unlock consume del orden de 300.000; se deja margen holgado
 * sin acercarse al límite que aceptan los RPC públicos.
 */
const LIMITE_GAS_COMPRA = 600_000n;

/**
 * Compra de una membresía en un Lock de Unlock.
 * Solo soporta Locks con precio en moneda nativa (ETH), que es la
 * configuración usada por Qupuy.
 */
export const useComprarAcceso = (lockAddress: Address | undefined) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const { data: precio } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "keyPrice",
    query: { enabled: Boolean(lockAddress) },
  });

  const comprar = async (): Promise<boolean> => {
    if (!lockAddress || !address || precio === undefined) {
      notification.error("Conecta tu wallet para comprar el acceso");
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
        functionName: "purchase",
        args: [[precio], [address], [DIRECCION_CERO], [DIRECCION_CERO], ["0x" as `0x${string}`]] as const,
        value: precio,
        account: address,
      } as const;

      // Simular antes de firmar: si el contrato va a rechazar la compra —por
      // ejemplo, si ya tienes una membresía— el usuario lo sabe sin gastar gas
      // ni recibir el error críptico del RPC.
      await publicClient.simulateContract(argumentos);

      const hash = await writeContractAsync({
        ...argumentos,
        // Sin este límite, una estimación fallida deja a la wallet cayendo a un
        // valor por defecto tan alto que algunos RPC rechazan la transacción.
        gas: LIMITE_GAS_COMPRA,
      });

      await publicClient.waitForTransactionReceipt({ hash });
      notification.success("¡Listo! Ya tienes acceso al curso");
      return true;
    } catch (error) {
      notification.error(getParsedError(error));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { comprar, isPending, precio };
};
