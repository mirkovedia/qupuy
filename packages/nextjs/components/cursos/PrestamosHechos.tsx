"use client";

import { AvisoRed } from "./AvisoRed";
import { Address } from "@scaffold-ui/components";
import type { Prestamo } from "~~/hooks/usePrestamos";
import { useRedDelLock } from "~~/hooks/useRedDelLock";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

type Props = {
  prestamos: Prestamo[];
  chainId: AllowedChainIds;
  /** Si ya tienes otro acceso a este curso, el Lock no deja recuperar el préstamo. */
  tieneAcceso: boolean;
  recuperando: boolean;
  onRecuperar: (tokenId: bigint) => void;
};

/**
 * Los accesos de un curso que has prestado, con el botón para recuperarlos.
 *
 * Una wallet solo puede tener una key por curso (`maxKeysPerAddress`). Si ya
 * tienes otra, recuperar el préstamo revertiría: se explica en lugar de
 * dejar que falle.
 */
export const PrestamosHechos = ({ prestamos, chainId, tieneAcceso, recuperando, onRecuperar }: Props) => {
  const { enRedCorrecta } = useRedDelLock(chainId);

  if (prestamos.length === 0) return null;

  return (
    <div className="space-y-2">
      <ul className="m-0 p-0 list-none space-y-2">
        {prestamos.map(prestamo => (
          <li
            key={prestamo.tokenId.toString()}
            className="flex flex-wrap items-center justify-between gap-2 border border-base-content/10 p-3"
          >
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-base-content/55">
              <span>Prestado a</span>
              <Address address={prestamo.prestadoA} size="xs" />
            </div>
            {!tieneAcceso && enRedCorrecta && (
              <button
                type="button"
                className="btn btn-xs btn-outline"
                disabled={recuperando}
                onClick={() => onRecuperar(prestamo.tokenId)}
              >
                {recuperando ? "Recuperando…" : "Recuperar"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {tieneAcceso ? (
        <p className="text-xs text-base-content/50 leading-relaxed m-0">
          Una wallet solo puede tener un acceso por curso. Para recuperar el préstamo, primero pasa el que tienes.
        </p>
      ) : !enRedCorrecta ? (
        <AvisoRed chainId={chainId} accion="recuperar tu acceso" compacto />
      ) : null}
    </div>
  );
};
