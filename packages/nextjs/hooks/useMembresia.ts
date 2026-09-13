"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { resolverLock } from "~~/contracts/unlock/locks";
import { DIRECCION_CERO, PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { type EstadoAcceso, calcularDiasRestantes, determinarEstado } from "~~/utils/membresia";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

export type Membresia = {
  estado: EstadoAcceso;
  tieneAcceso: boolean;
  /** true si el acceso es tuyo y puedes moverlo: no te lo prestaron. */
  puedeMover: boolean;
  /** Quien te prestó el acceso, si es un préstamo. Solo esa persona puede moverlo. */
  prestadoPor: Address | undefined;
  diasRestantes: number | undefined;
  tokenId: bigint | undefined;
  lockAddress: Address | undefined;
  /** Red donde vive el Lock. Las escrituras exigen que la wallet esté en ella. */
  chainId: AllowedChainIds;
  isLoading: boolean;
  refetch: () => void;
};

/**
 * Estado de acceso del usuario conectado para un curso.
 *
 * El acceso lo decide `getHasValidKey`: es el contrato explícito de "tiene
 * acceso ahora" y ejecuta los hooks de validez del Lock. `balanceOf` no sirve
 * para esto porque su semántica ha cambiado entre versiones del PublicLock
 * (en v14 solo cuenta keys válidas; en anteriores contaba todas). Apoyar el
 * acceso en ella acoplaría la app a la versión del contrato.
 *
 * Para saber si el usuario posee alguna key —vigente o vencida— y así llegar
 * a su tokenId se usa `totalKeys`, que cuenta todas.
 *
 * Las lecturas van siempre a la red del Lock, esté donde esté la wallet: un
 * usuario en otra red sigue viendo su estado. Solo escribir exige cambiar.
 */
export const useMembresia = (lockKey: string): Membresia => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;
  const lockAddress = resolverLock(lockKey, chainId);
  const habilitado = Boolean(lockAddress && address);
  const queryClient = useQueryClient();

  const { data: tieneKeyValida, isLoading: cargandoValidez } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "getHasValidKey",
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: habilitado },
  });

  const { data: totalKeys, isLoading: cargandoTotal } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "totalKeys",
    args: address ? [address] : undefined,
    chainId,
    query: { enabled: habilitado },
  });

  const poseeAlgunaKey = (totalKeys ?? 0n) > 0n;

  // Se asume que el índice 0 es la key del usuario en este Lock. Válido en
  // nuestro dominio: los Locks limitan a una key por wallet.
  const { data: tokenIdLeido } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "tokenOfOwnerByIndex",
    args: address ? [address, 0n] : undefined,
    chainId,
    query: { enabled: habilitado && poseeAlgunaKey },
  });

  // Cuando una consulta se desactiva —tras pasar el acceso, por ejemplo—
  // React Query conserva su último dato. Sin esta guarda, un tokenId que ya
  // no es nuestro produciría un estado "vencido" falso y una historia ajena.
  const tokenId = poseeAlgunaKey ? tokenIdLeido : undefined;

  const { data: expiracionLeida } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "keyExpirationTimestampFor",
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId,
    query: { enabled: habilitado && tokenId !== undefined },
  });
  const expiracion = tokenId !== undefined ? expiracionLeida : undefined;

  const { data: managerLeido } = useReadContract({
    address: lockAddress,
    abi: PUBLIC_LOCK_ABI,
    functionName: "keyManagerOf",
    args: tokenId !== undefined ? [tokenId] : undefined,
    chainId,
    query: { enabled: habilitado && tokenId !== undefined },
  });
  const manager = tokenId !== undefined ? managerLeido : undefined;

  const diasRestantes = expiracion !== undefined ? calcularDiasRestantes(expiracion) : undefined;
  const tieneAcceso = tieneKeyValida === true;
  const prestadoPor =
    manager && manager !== DIRECCION_CERO && address && manager.toLowerCase() !== address.toLowerCase()
      ? manager
      : undefined;

  return {
    estado: determinarEstado(tieneAcceso, diasRestantes),
    tieneAcceso,
    puedeMover: tieneAcceso && prestadoPor === undefined,
    prestadoPor,
    diasRestantes,
    tokenId,
    lockAddress,
    chainId,
    // Sigue en true mientras quede alguna consulta dependiente pendiente.
    // Sin esto, un consumidor vería "activo" sin días restantes por un instante.
    isLoading:
      cargandoValidez ||
      cargandoTotal ||
      (poseeAlgunaKey && tokenIdLeido === undefined) ||
      (tokenId !== undefined && expiracionLeida === undefined),
    // Invalida todas las lecturas de este Lock —las encadenadas se relanzan
    // solas cuando se habilitan— y las historias que dependen de ellas.
    refetch: () => {
      void queryClient.invalidateQueries({ queryKey: ["readContract", { address: lockAddress }] });
      void queryClient.invalidateQueries({ queryKey: ["linaje", chainId, lockAddress] });
      void queryClient.invalidateQueries({ queryKey: ["prestamos", chainId, lockAddress] });
    },
  };
};
