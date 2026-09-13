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
  /** Cuántas veces se pasó de una persona a otra (sin contar la compra). */
  vecesPasado: number;
  /** Personas distintas que han tenido este acceso. */
  personas: number;
  isLoading: boolean;
};

/**
 * Historia de un acceso: quién lo compró y por qué manos ha pasado.
 *
 * Se reconstruye desde los eventos `Transfer` del Lock. En un ERC-721 el
 * primero tiene `from = 0x0` — ese es el minteo, la compra original. Los
 * siguientes son transferencias reales entre personas.
 *
 * Esto es lo que ninguna plataforma de cursos puede mostrar: Udemy no sabe a
 * quién le prestaste tu cuenta. Aquí la cadena completa está en la blockchain.
 */
export const useLinajeAcceso = (lockKey: string, tokenId: bigint | undefined): Linaje => {
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const lockAddress = resolverLock(lockKey, chainId);

  const [pasos, setPasos] = useState<PasoLinaje[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lockAddress || !publicClient || tokenId === undefined) {
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
          args: { tokenId },
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
  const personas = new Set(pasos.map(p => p.hacia.toLowerCase())).size;

  return { pasos, vecesPasado, personas, isLoading };
};
