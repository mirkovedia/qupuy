import type { Address } from "viem";
import { DIRECCION_CERO } from "~~/contracts/unlock/publicLockAbi";

export type PasoLinaje = {
  /** De quién salió. `undefined` cuando es la compra original. */
  de?: Address;
  hacia: Address;
  bloque: bigint;
  hash: `0x${string}`;
  /** true si es el minteo: alguien compró el acceso al creador. */
  esCompra: boolean;
};

/** Lo que importa de un evento Transfer del Lock. */
export type RegistroTransfer = {
  args: { from?: Address; to?: Address; tokenId?: bigint };
  blockNumber: bigint | null;
  transactionHash: `0x${string}` | null;
};

/**
 * Convierte los eventos Transfer en los pasos de la historia de un acceso.
 *
 * En un ERC-721 el primer evento de cada key sale de la dirección cero: es
 * la compra. Los siguientes son manos reales. Y una quema (hacia la
 * dirección cero) no es una mano: se retira de la historia.
 */
export const registrosAPasos = (registros: RegistroTransfer[]): PasoLinaje[] =>
  registros
    .filter(r => (r.args.to ?? DIRECCION_CERO) !== DIRECCION_CERO)
    .map(r => {
      const desde = r.args.from ?? DIRECCION_CERO;
      return {
        de: desde === DIRECCION_CERO ? undefined : desde,
        hacia: r.args.to ?? DIRECCION_CERO,
        bloque: r.blockNumber ?? 0n,
        hash: r.transactionHash ?? "0x",
        esCompra: desde === DIRECCION_CERO,
      };
    });
