import type { Address } from "viem";
import { baseSepolia } from "viem/chains";

/**
 * Dirección placeholder mientras no se despliegan los Locks reales.
 * Se sustituye por variables de entorno en la Tarea 11.
 */
const PENDIENTE = "0x0000000000000000000000000000000000000000" as Address;

const leerLock = (variable: string | undefined): Address => (variable as Address | undefined) ?? PENDIENTE;

/**
 * Registro de Locks por red. Añadir una red es añadir una entrada aquí;
 * no requiere tocar componentes ni hooks.
 */
export const LOCKS_POR_RED: Record<number, Record<string, Address>> = {
  [baseSepolia.id]: {
    "ingles-basico": leerLock(process.env.NEXT_PUBLIC_LOCK_INGLES),
    "excel-negocios": leerLock(process.env.NEXT_PUBLIC_LOCK_EXCEL),
    "reparacion-celulares": leerLock(process.env.NEXT_PUBLIC_LOCK_CELULARES),
  },
};

/** Resuelve la dirección del Lock de un curso en la red indicada. */
export const resolverLock = (lockKey: string, chainId: number): Address | undefined =>
  LOCKS_POR_RED[chainId]?.[lockKey];
