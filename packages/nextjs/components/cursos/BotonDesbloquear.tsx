"use client";

import Link from "next/link";
import type { Address } from "viem";
import { formatEther } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useComprarAcceso } from "~~/hooks/useComprarAcceso";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
  lockAddress: Address | undefined;
  onCompraExitosa: () => void;
};

export const BotonDesbloquear = ({ curso, lockAddress, onCompraExitosa }: Props) => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const { switchChain, isPending: cambiandoRed } = useSwitchChain();
  const { comprar, isPending, precio } = useComprarAcceso(lockAddress);

  if (!address) {
    return (
      <div className="border border-base-content/15 bg-base-100 p-5">
        <p className="text-sm text-base-content/70 m-0">Conecta tu wallet para desbloquear este curso.</p>
      </div>
    );
  }

  // Sin Lock en la red activa: la wallet está en otra cadena. Se ofrece el
  // cambio en lugar de dejar al usuario sin saber qué hacer.
  if (!lockAddress) {
    return (
      <div className="border border-warning/35 bg-warning/10 p-5">
        <p className="text-sm m-0 mb-1 font-medium">Estás en otra red</p>
        <p className="text-sm text-base-content/70 m-0 mb-4">
          Qupuy funciona en {targetNetwork.name}. Cambia de red para desbloquear este curso.
        </p>
        <button
          type="button"
          className="btn btn-warning btn-sm w-full"
          disabled={cambiandoRed}
          onClick={() => switchChain?.({ chainId: targetNetwork.id })}
        >
          {cambiandoRed ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Cambiando…
            </>
          ) : (
            `Cambiar a ${targetNetwork.name}`
          )}
        </button>
      </div>
    );
  }

  const manejarCompra = async () => {
    const exitosa = await comprar();
    if (exitosa) onCompraExitosa();
  };

  return (
    <div className="border border-base-content/15 bg-base-100">
      <div className="aguayo aguayo-apagado" />

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-4">
          <span className="font-display text-3xl leading-none">Bs {curso.precioBs}</span>
          <span className="dato text-base-content/45">{curso.duracionDias} días</span>
        </div>

        <button type="button" className="btn btn-primary w-full" disabled={isPending} onClick={manejarCompra}>
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Procesando…
            </>
          ) : (
            "Desbloquear curso completo"
          )}
        </button>

        {precio !== undefined && (
          <p className="dato text-center text-base-content/40 mt-3 mb-0">{formatEther(precio)} ETH</p>
        )}

        <div className="mt-4 pt-4 border-t border-base-content/10">
          <p className="text-xs text-base-content/55 leading-relaxed m-0 mb-2">
            Tu acceso es tuyo: al terminar, se lo puedes pasar a alguien.
          </p>
          <Link href="/recibir" className="text-xs link text-base-content/45">
            ¿Alguien te va a pasar este curso? →
          </Link>
        </div>
      </div>
    </div>
  );
};
