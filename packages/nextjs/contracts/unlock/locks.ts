import { type Address, isAddress } from "viem";
import { sepolia } from "viem/chains";

/**
 * Bloque aproximado en el que se desplegaron los Locks.
 *
 * Las búsquedas de eventos parten de aquí: buscar desde el bloque cero hace
 * que los nodos públicos rechacen la petición.
 */
export const BLOQUE_DESPLIEGUE = 11690000n;

/**
 * Lee la dirección de un Lock desde el entorno.
 *
 * Se tolera lo que suele pasar al pegar en un panel: espacios, comillas y
 * mayúsculas sin checksum EIP-55 (la validación estricta de viem las
 * rechazaría). Se normaliza a minúsculas. Si falta o no es una dirección, el
 * curso queda sin Lock —y la interfaz lo dice— en lugar de consultar en
 * silencio a la dirección cero.
 */
export const leerLock = (variable: string | undefined, nombre: string): Address | undefined => {
  const limpia = variable?.trim().replace(/^["']|["']$/g, "");
  if (limpia && isAddress(limpia, { strict: false })) return limpia.toLowerCase() as Address;
  console.warn(`[qupuy] ${nombre} no está definida o no es una dirección válida; el curso quedará sin Lock`);
  return undefined;
};

export type RegistroLocks = Record<number, Record<string, Address | undefined>>;

/**
 * Registro de Locks por red. Añadir una red es añadir una entrada aquí;
 * no requiere tocar componentes ni hooks.
 */
export const LOCKS_POR_RED: RegistroLocks = {
  [sepolia.id]: {
    "ingles-basico": leerLock(process.env.NEXT_PUBLIC_LOCK_INGLES, "NEXT_PUBLIC_LOCK_INGLES"),
    "excel-negocios": leerLock(process.env.NEXT_PUBLIC_LOCK_EXCEL, "NEXT_PUBLIC_LOCK_EXCEL"),
    "reparacion-celulares": leerLock(process.env.NEXT_PUBLIC_LOCK_CELULARES, "NEXT_PUBLIC_LOCK_CELULARES"),
  },
};

/** Resuelve la dirección del Lock de un curso en la red indicada. */
export const resolverLock = (
  lockKey: string,
  chainId: number,
  registro: RegistroLocks = LOCKS_POR_RED,
): Address | undefined => registro[chainId]?.[lockKey];
