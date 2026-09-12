const SEGUNDOS_POR_DIA = 86_400;

/**
 * Días completos que faltan para que expire una membresía.
 * Devuelve 0 si ya expiró.
 *
 * @param expiracion timestamp UNIX en segundos, tal como lo devuelve
 *                   keyExpirationTimestampFor
 */
export const calcularDiasRestantes = (expiracion: bigint, ahora: Date = new Date()): number => {
  const ahoraEnSegundos = BigInt(Math.floor(ahora.getTime() / 1000));
  if (expiracion <= ahoraEnSegundos) return 0;
  return Number((expiracion - ahoraEnSegundos) / BigInt(SEGUNDOS_POR_DIA));
};

export type EstadoAcceso = "activo" | "vencido" | "sin-acceso";

/**
 * Traduce la respuesta del contrato a un estado de UI.
 *
 * @param tieneKeyValida resultado de getHasValidKey
 * @param diasRestantes  undefined si el usuario nunca tuvo una key
 */
export const determinarEstado = (tieneKeyValida: boolean, diasRestantes: number | undefined): EstadoAcceso => {
  if (tieneKeyValida) return "activo";
  if (diasRestantes !== undefined) return "vencido";
  return "sin-acceso";
};
