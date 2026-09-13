import { createPublicClient, fallback, http } from "viem";
import { sepolia } from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

/** Red en la que viven los Locks. */
export const RED_DEL_LOCK = sepolia;

/**
 * Cliente de solo lectura para consultar el Lock desde el servidor.
 *
 * Alchemy va primero: el RPC público rechaza algunas peticiones y aquí no
 * hay interfaz que muestre un reintento.
 */
export const clienteServidor = createPublicClient({
  chain: RED_DEL_LOCK,
  transport: fallback([http(`https://eth-sepolia.g.alchemy.com/v2/${scaffoldConfig.alchemyApiKey}`), http()]),
});
