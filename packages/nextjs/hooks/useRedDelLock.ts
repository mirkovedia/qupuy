"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

/**
 * Si la wallet está en la red del Lock.
 *
 * Se mira la cadena real de la wallet (`useAccount().chain`), no la que wagmi
 * tiene como activa: cuando la wallet está en una red que no configuramos,
 * wagmi conserva la anterior y una escritura se firmaría donde no debe.
 * `chain` es `undefined` en ese caso, y aquí cuenta como red incorrecta.
 */
export const useRedDelLock = (chainId: AllowedChainIds) => {
  const { chain, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { switchChain, isPending } = useSwitchChain();

  return {
    conectado: isConnected,
    enRedCorrecta: chain?.id === chainId,
    nombreRed: targetNetwork.name,
    cambiando: isPending,
    cambiarRed: () => switchChain?.({ chainId }),
  };
};
