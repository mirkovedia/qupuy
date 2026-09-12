"use client";

import type { Address } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useComprarAcceso } from "~~/hooks/useComprarAcceso";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
  lockAddress: Address | undefined;
  onCompraExitosa: () => void;
};

export const BotonDesbloquear = ({ curso, lockAddress, onCompraExitosa }: Props) => {
  const { address } = useAccount();
  const { comprar, isPending, precio } = useComprarAcceso(lockAddress);

  if (!address) {
    return (
      <div className="border border-base-content/15 bg-base-100 p-5">
        <p className="text-sm text-base-content/70 m-0">Conecta tu wallet para desbloquear este curso.</p>
      </div>
    );
  }

  if (!lockAddress) {
    return (
      <div className="border border-warning/35 bg-warning/10 p-5">
        <p className="text-sm m-0">Este curso no está disponible en la red seleccionada.</p>
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

        <p className="text-xs text-base-content/55 leading-relaxed mt-4 mb-0 pt-4 border-t border-base-content/10">
          Tu acceso es tuyo: al terminar, se lo puedes pasar a alguien.
        </p>
      </div>
    </div>
  );
};
