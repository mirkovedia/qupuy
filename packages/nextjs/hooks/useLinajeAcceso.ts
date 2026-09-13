"use client";

import { useEffect, useState } from "react";
import { type Address, parseAbiItem } from "viem";
import { useChainId, usePublicClient } from "wagmi";
import { resolverLock } from "~~/contracts/unlock/locks";

const DIRECCION_CERO = "0x0000000000000000000000000000000000000000" as Address;

const EVENTO_TRANSFER = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

/**
 * Bloque aproximado en el que se desplegaron los Locks.
 *
 * Buscar desde el bloque cero hace que los nodos públicos rechacen la
 * petición: son millones de bloques que revisar. Partir del despliegue
 * reduce el rango a unos pocos miles.
 */
const BLOQUE_DESPLIEGUE = 11690000n;

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
 */
export const useLinajeAcceso = (lockKey: string, tokenId?: bigint): Linaje => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const lockAddress = resolverLock(lockKey, chainId);

  const [pasos, setPasos] = useState<PasoLinaje[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lockAddress || !publicClient) {
      setPasos([]);
      return;
    }

    let cancelado = false;
    setIsLoading(true);

    const leer = async () => {
      try {
        const registros = await publicClient.getLogs({
          address: lockAddress,
          event: EVENTO_TRANSFER,
          // Sin tokenId se leen todos los accesos del curso, no uno solo.
          args: tokenId === undefined ? undefined : { tokenId },
          fromBlock: BLOQUE_DESPLIEGUE,
          toBlock: "latest",
        });

        if (cancelado) return;

        const historia: PasoLinaje[] = registros.map(r => {
          const desde = r.args.from ?? DIRECCION_CERO;
          return {
            de: desde === DIRECCION_CERO ? undefined : desde,
            hacia: r.args.to ?? DIRECCION_CERO,
            bloque: r.blockNumber ?? 0n,
            hash: r.transactionHash ?? "0x",
            esCompra: desde === DIRECCION_CERO,
          };
        });

        setPasos(historia);
      } catch {
        // Un RPC que no soporta rangos amplios devuelve error: el linaje
        // simplemente no se muestra, sin romper la página.
        if (!cancelado) setPasos([]);
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    };

    void leer();
    return () => {
      cancelado = true;
    };
  }, [lockAddress, publicClient, tokenId]);

  const vecesPasado = pasos.filter(p => !p.esCompra).length;
  const compras = pasos.filter(p => p.esCompra).length;
  const personas = new Set(pasos.map(p => p.hacia.toLowerCase())).size;

  return { pasos, vecesPasado, compras, personas, esDelCurso: tokenId === undefined, isLoading };
};
