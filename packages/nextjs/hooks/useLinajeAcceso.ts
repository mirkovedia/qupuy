"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";
import { usePublicClient, useReadContract } from "wagmi";
import { BLOQUE_DESPLIEGUE, resolverLock } from "~~/contracts/unlock/locks";
import { DIRECCION_CERO, EVENTO_TRANSFER, PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

export type PasoLinaje = {
  /** De quién salió. `undefined` cuando es la compra original. */
  de?: Address;
  hacia: Address;
  bloque: bigint;
  hash: `0x${string}`;
  /** true si es el minteo: alguien compró el acceso al creador. */
  esCompra: boolean;
};

export type Linaje = {
  pasos: PasoLinaje[];
  /** Cuántas veces se pasó de una persona a otra (sin contar las compras). */
  vecesPasado: number;
  /** Personas distintas que han tenido un acceso a este curso. */
  personas: number;
  /** Cuántos accesos se han comprado al creador. */
  compras: number;
  /** true cuando se muestra la actividad del curso, no la de un acceso concreto. */
  esDelCurso: boolean;
  isLoading: boolean;
  /** true si la historia no se pudo leer. Los contadores del contrato siguen disponibles. */
  hayError: boolean;
  reintentar: () => void;
};

/**
 * Historia de los accesos a un curso.
 *
 * Con `tokenId`, reconstruye el recorrido de ese acceso concreto: quién lo
 * compró y a quién se lo fue pasando. Sin él, devuelve la actividad completa
 * del curso — cuántos accesos se vendieron y cuántas veces circularon — para
 * que un visitante pueda verlo antes de comprar.
 *
 * Se lee de los eventos `Transfer` del Lock. En un ERC-721 el primero de cada
 * token tiene `from = 0x0`: ese es el minteo, la compra original. Los
 * siguientes son transferencias reales entre personas.
 *
 * Esto es lo que ninguna plataforma de cursos puede mostrar: Udemy no sabe a
 * quién le prestaste tu cuenta. Aquí la cadena completa está en la blockchain.
 *
 * La consulta vive en React Query: se invalida tras cada transacción, así
 * que la historia se actualiza sola en cuanto un acceso cambia de manos.
 */
export const useLinajeAcceso = (lockKey: string, tokenId?: bigint): Linaje => {
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;
  const publicClient = usePublicClient({ chainId });
  const lockAddress = resolverLock(lockKey, chainId);

  const {
    data: pasos = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["linaje", chainId, lockAddress, tokenId === undefined ? "curso" : tokenId.toString()],
    enabled: Boolean(lockAddress && publicClient),
    retry: 1,
    queryFn: async (): Promise<PasoLinaje[]> => {
      if (!lockAddress || !publicClient) return [];
      try {
        const registros = await publicClient.getLogs({
          address: lockAddress,
          event: EVENTO_TRANSFER,
          // Sin tokenId se leen todos los accesos del curso, no uno solo.
          args: tokenId === undefined ? undefined : { tokenId },
          fromBlock: BLOQUE_DESPLIEGUE,
          toBlock: "latest",
        });

        return registros.map(r => {
          const desde = r.args.from ?? DIRECCION_CERO;
          return {
            de: desde === DIRECCION_CERO ? undefined : desde,
            hacia: r.args.to ?? DIRECCION_CERO,
            bloque: r.blockNumber ?? 0n,
            hash: r.transactionHash ?? "0x",
            esCompra: desde === DIRECCION_CERO,
          };
        });
      } catch (error) {
        // Un RPC que no soporta el rango devuelve error. Se registra y se
        // propaga: la interfaz lo muestra y ofrece reintentar, en lugar de
        // hacer desaparecer la sección sin explicación.
        console.error("No se pudo leer la historia del acceso", error);
        throw error;
      }
    },
  });

  // El número de accesos vendidos también vive en el contrato: si los
  // eventos no se pudieron leer, el dato principal sigue estando.
  const { data: totalSupply } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "totalSupply",
    chainId,
    query: { enabled: Boolean(lockAddress) && tokenId === undefined },
  });

  const vecesPasado = pasos.filter(p => !p.esCompra).length;
  const comprasEnEventos = pasos.filter(p => p.esCompra).length;
  const compras = comprasEnEventos > 0 ? comprasEnEventos : Number(totalSupply ?? 0n);
  const personas = new Set(pasos.map(p => p.hacia.toLowerCase())).size;

  return {
    pasos,
    vecesPasado,
    compras,
    personas,
    esDelCurso: tokenId === undefined,
    isLoading,
    hayError: isError,
    reintentar: () => {
      void refetch();
    },
  };
};
