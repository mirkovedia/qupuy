import { type Address, createPublicClient, fallback, http } from "viem";
import { sepolia } from "viem/chains";
import { EVENTO_TRANSFER } from "~~/contracts/unlock/publicLockAbi";
import { DEFAULT_ALCHEMY_API_KEY } from "~~/scaffold.config";

/**
 * Cliente de solo lectura para los eventos del Lock.
 *
 * Va aparte del cliente general porque `eth_getLogs` es la petición que los
 * proveedores más limitan: el plan gratuito de Alchemy la restringe a 10
 * bloques y el RPC público por defecto la rechaza. Medido el 2026-09-13:
 * Tenderly acepta 200k bloques y PublicNode 50k. La clave compartida de
 * Scaffold-ETH queda de último recurso.
 */
export const clienteEventos = createPublicClient({
  chain: sepolia,
  transport: fallback(
    [
      http("https://sepolia.gateway.tenderly.co", { retryCount: 1 }),
      http("https://ethereum-sepolia-rpc.publicnode.com", { retryCount: 1 }),
      http(`https://eth-sepolia.g.alchemy.com/v2/${DEFAULT_ALCHEMY_API_KEY}`, { retryCount: 1 }),
    ],
    { retryCount: 0 },
  ),
});

/** Bloques por petición: por debajo del límite más bajo de los RPC usados. */
export const TAMANO_TRAMO = 40_000n;

export type Tramo = { desde: bigint; hasta: bigint };

/** Divide un rango de bloques en tramos consecutivos de como mucho `tamano`. */
export const partirEnTramos = (desde: bigint, hasta: bigint, tamano: bigint = TAMANO_TRAMO): Tramo[] => {
  if (hasta < desde || tamano <= 0n) return [];
  const tramos: Tramo[] = [];
  for (let inicio = desde; inicio <= hasta; inicio += tamano) {
    const fin = inicio + tamano - 1n < hasta ? inicio + tamano - 1n : hasta;
    tramos.push({ desde: inicio, hasta: fin });
  }
  return tramos;
};

type FiltroTransfer = { from?: Address; to?: Address; tokenId?: bigint };

const leerTramo = (lockAddress: Address, tramo: Tramo, args?: FiltroTransfer) =>
  clienteEventos.getLogs({
    address: lockAddress,
    event: EVENTO_TRANSFER,
    args,
    fromBlock: tramo.desde,
    toBlock: tramo.hasta,
  });

/** Un evento Transfer tal como lo devuelve viem, con sus argumentos decodificados. */
export type LogTransfer = Awaited<ReturnType<typeof leerTramo>>[number];

/**
 * Lee los eventos `Transfer` de un Lock desde `desde` hasta el último bloque,
 * en tramos en paralelo, ordenados como ocurrieron.
 */
export const leerTransferencias = async (
  lockAddress: Address,
  desde: bigint,
  args?: FiltroTransfer,
): Promise<LogTransfer[]> => {
  const ultimo = await clienteEventos.getBlockNumber();
  const tramos = partirEnTramos(desde, ultimo);
  const porTramo = await Promise.all(tramos.map(tramo => leerTramo(lockAddress, tramo, args)));
  return porTramo
    .flat()
    .sort((a, b) =>
      a.blockNumber === b.blockNumber ? (a.logIndex ?? 0) - (b.logIndex ?? 0) : a.blockNumber < b.blockNumber ? -1 : 1,
    );
};
