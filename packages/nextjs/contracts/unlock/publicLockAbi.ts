import { parseAbiItem } from "viem";

/**
 * ABI mínimo del contrato PublicLock de Unlock Protocol.
 *
 * Solo incluye lo que usa Qupuy. Verificado contra el código fuente de la
 * versión desplegada: `publicLockVersion()` devuelve 14 en los tres Locks.
 * Referencia: https://docs.unlock-protocol.com/core-protocol/smart-contracts-api/publiclock/
 */
export const PUBLIC_LOCK_ABI = [
  // ── Acceso ───────────────────────────────────────────────────────────────
  {
    inputs: [{ internalType: "address", name: "_keyOwner", type: "address" }],
    name: "getHasValidKey",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    // Cuenta todas las keys de una wallet, vencidas incluidas. Es la que
    // permite llegar al tokenId de una membresía que ya expiró.
    inputs: [{ internalType: "address", name: "_keyOwner", type: "address" }],
    name: "totalKeys",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    // En v14 solo cuenta keys válidas. No se usa para decidir nada: queda
    // para poder compararla con totalKeys y getHasValidKey desde /debug.
    inputs: [{ internalType: "address", name: "_keyOwner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_keyOwner", type: "address" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "keyExpirationTimestampFor",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    // Quién controla una key. Dirección cero significa "su dueño". Tras un
    // préstamo (lendKey) es quien la prestó, y el dueño no puede moverla.
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "keyManagerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },

  // ── Configuración del Lock ───────────────────────────────────────────────
  {
    inputs: [],
    name: "keyPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    // El precio que Unlock documenta para una compra: respeta los hooks de
    // descuento del Lock. keyPrice es solo el precio de lista.
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "address", name: "_referrer", type: "address" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "purchasePriceFor",
    outputs: [{ internalType: "uint256", name: "minKeyPrice", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "expirationDuration",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "_totalKeysCreated", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },

  // ── Escritura ────────────────────────────────────────────────────────────
  {
    inputs: [
      { internalType: "uint256[]", name: "_values", type: "uint256[]" },
      { internalType: "address[]", name: "_recipients", type: "address[]" },
      { internalType: "address[]", name: "_referrers", type: "address[]" },
      { internalType: "address[]", name: "_keyManagers", type: "address[]" },
      { internalType: "bytes[]", name: "_data", type: "bytes[]" },
    ],
    name: "purchase",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    // Renueva una key existente. Es la única vía cuando ya posees una,
    // aunque esté vencida: purchase la rechaza con MAX_KEYS_REACHED.
    inputs: [
      { internalType: "uint256", name: "_value", type: "uint256" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "address", name: "_referrer", type: "address" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "extend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    // Regalar: el receptor pasa a ser dueño pleno y el key manager se reinicia.
    inputs: [
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    // Prestar: el receptor tiene el acceso, pero quien presta sigue siendo el
    // key manager. El receptor no puede pasarlo y el préstamo se puede recuperar.
    inputs: [
      { internalType: "address", name: "_from", type: "address" },
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "lendKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    // Recuperar un préstamo: solo puede llamarla el key manager.
    inputs: [
      { internalType: "address", name: "_recipient", type: "address" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
    ],
    name: "unlendKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },

  // ── Eventos ──────────────────────────────────────────────────────────────
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;

/** El evento Transfer del ERC-721, listo para `getLogs`. */
export const EVENTO_TRANSFER = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
);

export const DIRECCION_CERO = "0x0000000000000000000000000000000000000000" as const;

/** Argumento `_data` vacío para purchase y extend. */
export const SIN_DATOS = "0x" as const;
