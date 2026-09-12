/**
 * ABI mínimo del contrato PublicLock de Unlock Protocol.
 * Solo incluye las funciones que usa Qupuy.
 * Referencia: https://docs.unlock-protocol.com/core-protocol/smart-contracts-api/publiclock/
 */
export const PUBLIC_LOCK_ABI = [
  {
    inputs: [{ internalType: "address", name: "_keyOwner", type: "address" }],
    name: "getHasValidKey",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
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
    inputs: [],
    name: "keyPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
] as const;
