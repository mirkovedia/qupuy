"use client";

import { useState } from "react";
import type { Address } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { DIRECCION_CERO, PUBLIC_LOCK_ABI, SIN_DATOS } from "~~/contracts/unlock/publicLockAbi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { explicarError } from "~~/utils/erroresDelLock";
import { type AllowedChainIds, notification } from "~~/utils/scaffold-eth";

const SEGUNDOS_POR_DIA = 86_400n;

/**
 * Techo de gas para `purchase` y `extend`.
 *
 * Una compra en Unlock consume del orden de 300.000; se deja margen holgado
 * sin acercarse al límite que aceptan los RPC públicos.
 */
const LIMITE_GAS_COMPRA = 600_000n;

/**
 * Compra o renovación de una membresía en un Lock de Unlock.
 *
 * Con `tokenIdVencido`, la operación es una renovación. Unlock no permite
 * volver a comprar cuando ya posees una key —aunque esté vencida— porque el
 * límite por wallet cuenta todas (`MAX_KEYS_REACHED`); la vía correcta es
 * `extend` sobre la key existente.
 *
 * Solo soporta Locks que cobran en la moneda nativa: es la configuración de
 * Qupuy, y se comprueba antes de enviar valor.
 */
export const useComprarAcceso = (lockAddress: Address | undefined, tokenIdVencido?: bigint) => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;
  const publicClient = usePublicClient({ chainId });
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);

  const lectura = { address: lockAddress, abi: PUBLIC_LOCK_ABI, chainId } as const;
  const habilitado = Boolean(lockAddress);

  // Precio de lista, para mostrarlo sin wallet conectada.
  const { data: precioBase } = useReadContract({
    ...lectura,
    functionName: "keyPrice",
    query: { enabled: habilitado },
  });

  // Precio para esta wallet: es el que Unlock documenta para una compra y
  // respeta los hooks de descuento del Lock.
  const { data: precioPersonal } = useReadContract({
    ...lectura,
    functionName: "purchasePriceFor",
    args: address ? [address, DIRECCION_CERO, SIN_DATOS] : undefined,
    query: { enabled: habilitado && Boolean(address) },
  });

  const { data: moneda } = useReadContract({
    ...lectura,
    functionName: "tokenAddress",
    query: { enabled: habilitado },
  });

  // La duración se lee del contrato: es la única fuente de verdad.
  const { data: duracion } = useReadContract({
    ...lectura,
    functionName: "expirationDuration",
    query: { enabled: habilitado },
  });

  const precio = precioPersonal ?? precioBase;
  const duracionDias = duracion !== undefined ? Number(duracion / SEGUNDOS_POR_DIA) : undefined;
  const esRenovacion = tokenIdVencido !== undefined;

  const comprar = async (): Promise<boolean> => {
    if (!lockAddress || !address) {
      notification.error("Conecta tu wallet para desbloquear el curso");
      return false;
    }

    if (precio === undefined) {
      notification.error("Todavía estamos leyendo el precio. Inténtalo en un momento.");
      return false;
    }

    if (moneda !== undefined && moneda !== DIRECCION_CERO) {
      notification.error("Este curso cobra en un token que Qupuy no soporta todavía");
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
      const comun = { address: lockAddress, abi: PUBLIC_LOCK_ABI, value: precio, account: address, chainId } as const;

      // Simular antes de firmar: si el contrato va a rechazar la operación,
      // el usuario lo sabe sin gastar gas ni recibir el error críptico del RPC.
      let hash: `0x${string}`;
      if (tokenIdVencido !== undefined) {
        const argumentos = {
          ...comun,
          functionName: "extend",
          args: [precio, tokenIdVencido, DIRECCION_CERO, SIN_DATOS],
        } as const;
        await publicClient.simulateContract(argumentos);
        hash = await writeContractAsync({ ...argumentos, gas: LIMITE_GAS_COMPRA });
      } else {
        const argumentos = {
          ...comun,
          functionName: "purchase",
          args: [[precio], [address], [DIRECCION_CERO], [DIRECCION_CERO], [SIN_DATOS]],
        } as const;
        await publicClient.simulateContract(argumentos);
        // Sin el límite, una estimación fallida deja a la wallet cayendo a un
        // valor por defecto tan alto que algunos RPC rechazan la transacción.
        hash = await writeContractAsync({ ...argumentos, gas: LIMITE_GAS_COMPRA });
      }

      const recibo = await publicClient.waitForTransactionReceipt({ hash });
      if (recibo.status !== "success") {
        notification.error("La transacción se minó pero el contrato la rechazó. No se te cobró el acceso.");
        return false;
      }

      notification.success(esRenovacion ? "¡Listo! Tu acceso está renovado" : "¡Listo! Ya tienes acceso al curso");
      return true;
    } catch (error) {
      notification.error(explicarError(error));
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { comprar, isPending, precio, duracionDias, esRenovacion };
};
