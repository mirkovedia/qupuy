"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";
import { useReadContracts } from "wagmi";
import { resolverLock } from "~~/contracts/unlock/locks";
import { DIRECCION_CERO, PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import type { Curso } from "~~/types/curso";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

const INTERVALO_MS = 3_000;

export type AccesosDe = {
  /** Cursos a los que la dirección tiene acceso ahora mismo. */
  conAcceso: Curso[];
  /** Cursos cuyo acceso llegó mientras esta pantalla estaba abierta. */
  recibidos: Curso[];
  isLoading: boolean;
};

/**
 * Qué cursos tiene una dirección, consultando el contrato cada pocos
 * segundos. Sirve para que la pantalla del receptor reaccione sola cuando
 * le llega un acceso: no hace falta recargar ni que nadie le avise.
 *
 * Se usa `getHasValidKey` en un multicall: una petición para todos los
 * Locks, sin leer eventos.
 */
export const useAccesosDe = (address: Address | undefined, cursos: Curso[]): AccesosDe => {
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;

  const pares = cursos
    .map(curso => ({ curso, lockAddress: resolverLock(curso.lockKey, chainId) }))
    .filter((par): par is { curso: Curso; lockAddress: Address } => par.lockAddress !== undefined);

  // Los literales `as const` conservan el tipo de la función: sin ellos,
  // wagmi infiere la unión de todas las salidas del ABI y el resultado no
  // se puede comparar con un booleano. Sin dirección la consulta no corre.
  const { data, isLoading } = useReadContracts({
    contracts: pares.map(par => ({
      address: par.lockAddress,
      abi: PUBLIC_LOCK_ABI,
      functionName: "getHasValidKey" as const,
      args: [address ?? DIRECCION_CERO] as const,
      chainId,
    })),
    allowFailure: true,
    query: { enabled: Boolean(address) && pares.length > 0, refetchInterval: INTERVALO_MS },
  });

  const conAcceso = pares.filter((_, i) => data?.[i]?.result === true).map(par => par.curso);
  const slugsConAcceso = conAcceso.map(c => c.slug).join(",");

  // Lo que ya tenía al abrir la pantalla no cuenta como recibido.
  const [inicial, setInicial] = useState<string[] | null>(null);
  useEffect(() => {
    if (data === undefined || inicial !== null) return;
    setInicial(slugsConAcceso === "" ? [] : slugsConAcceso.split(","));
  }, [data, inicial, slugsConAcceso]);

  const recibidos = inicial === null ? [] : conAcceso.filter(curso => !inicial.includes(curso.slug));

  return { conAcceso, recibidos, isLoading };
};
