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
      <div className="alert alert-info">
        <span>Conecta tu wallet para desbloquear este curso.</span>
      </div>
    );
  }

  if (!lockAddress) {
    return (
      <div className="alert alert-warning">
        <span>Este curso no está disponible en la red seleccionada.</span>
      </div>
    );
  }

  const manejarCompra = async () => {
    const exitosa = await comprar();
    if (exitosa) onCompraExitosa();
  };

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <button type="button" className="btn btn-primary btn-lg" disabled={isPending} onClick={manejarCompra}>
          {isPending ? (
            <>
              <span className="loading loading-spinner" />
              Procesando…
            </>
          ) : (
            <>🔓 Desbloquear curso completo</>
          )}
        </button>

        <p className="text-center text-sm text-base-content/70">
          Bs {curso.precioBs} · acceso por {curso.duracionDias} días
          {precio !== undefined && <span className="block">({formatEther(precio)} ETH)</span>}
        </p>

        <p className="text-center text-xs text-base-content/60">
          Tu acceso es tuyo: al terminar, se lo puedes pasar a alguien.
        </p>
      </div>
    </div>
  );
};
