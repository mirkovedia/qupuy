import { BaseError, ContractFunctionRevertedError } from "viem";
import { getParsedError } from "~~/utils/scaffold-eth";

/**
 * Qué le decimos a la persona cuando el Lock rechaza una operación.
 *
 * Son los errores personalizados del PublicLock v14 que pueden salir de las
 * funciones que usa Qupuy. Cualquier otro cae al mensaje genérico de viem.
 */
export const MENSAJES_DEL_LOCK: Record<string, string> = {
  MAX_KEYS_REACHED: "Esa wallet ya tiene un acceso a este curso. Una wallet solo puede tener uno a la vez.",
  UNAUTHORIZED: "No tienes permiso para mover este acceso. Si te lo prestaron, solo quien lo prestó puede moverlo.",
  ONLY_KEY_MANAGER_OR_APPROVED:
    "No tienes permiso para mover este acceso. Si te lo prestaron, solo quien lo prestó puede moverlo.",
  KEY_NOT_VALID: "Este acceso está vencido: no se puede pasar. Renuévalo primero.",
  TRANSFER_TO_SELF: "No puedes pasarte el acceso a ti mismo.",
  KEY_TRANSFERS_DISABLED: "Este curso no permite pasar el acceso.",
  NO_SUCH_KEY: "Ese acceso ya no existe.",
  INVALID_ADDRESS: "Esa dirección no es válida.",
  LOCK_SOLD_OUT: "Este curso ya no tiene accesos disponibles.",
  INSUFFICIENT_VALUE: "El monto enviado no cubre el precio del acceso.",
  NOT_ENOUGH_FUNDS: "No hay fondos suficientes para completar la operación.",
  CANT_EXTEND_NON_EXPIRING_KEY: "Este acceso no vence: no hace falta renovarlo.",
  NON_RENEWABLE_LOCK: "Este curso no permite renovar el acceso.",
};

/** Mensaje para un nombre de error del Lock, o undefined si no lo conocemos. */
export const mensajeParaError = (nombre: string | undefined): string | undefined =>
  nombre ? MENSAJES_DEL_LOCK[nombre] : undefined;

/**
 * Traduce un error de viem/wagmi a una frase para la persona.
 *
 * Si el contrato revirtió con un error declarado en el ABI, viem lo decodifica
 * y aquí se convierte en una explicación. Si no, se usa el parser de
 * Scaffold-ETH, y el "execution reverted" pelado se sustituye por algo legible.
 */
export const explicarError = (error: unknown): string => {
  if (error instanceof BaseError) {
    const revertido = error.walk(e => e instanceof ContractFunctionRevertedError);
    if (revertido instanceof ContractFunctionRevertedError) {
      const conocido = mensajeParaError(revertido.data?.errorName);
      if (conocido) return conocido;
    }
  }
  const generico = getParsedError(error);
  if (/execution reverted/i.test(generico)) return "El contrato rechazó la operación. No se envió ninguna transacción.";
  return generico;
};
