"use client";

import { useRedDelLock } from "~~/hooks/useRedDelLock";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

type Props = {
  chainId: AllowedChainIds;
  /** Qué quiere hacer el usuario, para completar "Cambia de red para …". */
  accion: string;
  compacto?: boolean;
};

/**
 * La wallet está en otra red: se ofrece el cambio en lugar de dejar al
 * usuario sin saber qué hacer.
 */
export const AvisoRed = ({ chainId, accion, compacto = false }: Props) => {
  const { nombreRed, cambiarRed, cambiando } = useRedDelLock(chainId);

  return (
    <div className={`border border-warning/35 bg-warning/10 ${compacto ? "p-3" : "p-5"}`}>
      <p className="text-sm m-0 mb-1 font-medium">Estás en otra red</p>
      <p className="text-sm text-base-content/70 m-0 mb-3">
        Qupuy funciona en {nombreRed}. Cambia de red para {accion}.
      </p>
      <button type="button" className="btn btn-warning btn-sm w-full" disabled={cambiando} onClick={cambiarRed}>
        {cambiando ? (
          <>
            <span className="loading loading-spinner loading-xs" />
            Cambiando…
          </>
        ) : (
          `Cambiar a ${nombreRed}`
        )}
      </button>
    </div>
  );
};
