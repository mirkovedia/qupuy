"use client";

import type { Address } from "viem";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { resolverLock } from "~~/contracts/unlock/locks";
import { PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { type EstadoAcceso, calcularDiasRestantes, determinarEstado } from "~~/utils/membresia";

export type Membresia = {
  estado: EstadoAcceso;
  tieneAcceso: boolean;
  diasRestantes: number | undefined;
  tokenId: bigint | undefined;
  lockAddress: Address | undefined;
  isLoading: boolean;
  refetch: () => void;
};

/**
 * Estado de acceso del usuario conectado para un curso.
 *
 * IMPORTANTE: usa getHasValidKey, no balanceOf. balanceOf cuenta también las
 * membresías vencidas, porque el NFT permanece en la wallet tras expirar.
 */
export const useMembresia = (lockKey: string): Membresia => {
  const { address } = useAccount();
  const chainId = useChainId();
  const lockAddress = resolverLock(lockKey, chainId);
  const habilitado = Boolean(lockAddress && address);

  const {
    data: tieneKeyValida,
    isLoading: cargandoValidez,
    refetch: refetchValidez,
  } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "getHasValidKey",
    args: address ? [address] : undefined,
    query: { enabled: habilitado },
  });

  const {
    data: balance,
    isLoading: cargandoBalance,
    refetch: refetchBalance,
  } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: habilitado },
  });

  const poseeAlgunaKey = (balance ?? 0n) > 0n;

  // Se asume que el índice 0 es la key vigente del usuario en este Lock.
  // Válido en nuestro dominio (una membresía por curso, un lock por curso);
  // si un usuario llegara a acumular varias keys del mismo Lock, el índice 0
  // no es necesariamente la más reciente ni la vigente.
  const { data: tokenId, refetch: refetchToken } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: address ? [address, 0n] : undefined,
    query: { enabled: habilitado && poseeAlgunaKey },
  });

  const { data: expiracion, refetch: refetchExpiracion } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "keyExpirationTimestampFor",
    args: tokenId !== undefined ? [tokenId] : undefined,
    query: { enabled: habilitado && tokenId !== undefined },
  });

  const diasRestantes = expiracion !== undefined ? calcularDiasRestantes(expiracion) : undefined;
  const tieneAcceso = tieneKeyValida === true;

  return {
    estado: determinarEstado(tieneAcceso, diasRestantes),
    tieneAcceso,
    diasRestantes,
    tokenId,
    lockAddress,
    // Sigue en true mientras quede alguna consulta dependiente pendiente:
    // getHasValidKey/balanceOf en vuelo, balanceOf resuelto con keys pero
    // tokenId aún sin llegar, o tokenId resuelto con expiracion aún sin llegar.
    // Sin esto, un consumidor vería "activo" sin días restantes por un instante.
    isLoading:
      cargandoValidez ||
      cargandoBalance ||
      (poseeAlgunaKey && tokenId === undefined) ||
      (tokenId !== undefined && expiracion === undefined),
    // Dispara de nuevo las cuatro consultas; el reencadenamiento (balanceOf ->
    // tokenOfOwnerByIndex -> keyExpirationTimestampFor) no es inmediato: ocurre
    // por reactividad de wagmi/React Query cuando cambian `enabled` y los args.
    refetch: () => {
      void refetchValidez();
      void refetchBalance();
      void refetchToken();
      void refetchExpiracion();
    },
  };
};
