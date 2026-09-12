"use client";

import { useState } from "react";
import { AddressInput } from "@scaffold-ui/components";
import type { Address } from "viem";
import { useTransferirAcceso } from "~~/hooks/useTransferirAcceso";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
  lockAddress: Address | undefined;
  tokenId: bigint | undefined;
  onTransferencia: () => void;
};

export const ModalTransferir = ({ curso, lockAddress, tokenId, onTransferencia }: Props) => {
  const [abierto, setAbierto] = useState(false);
  const [destino, setDestino] = useState("");
  const { transferir, isPending } = useTransferirAcceso(lockAddress, tokenId);

  const manejarTransferencia = async () => {
    const exitosa = await transferir(destino as Address);
    if (exitosa) {
      setAbierto(false);
      setDestino("");
      onTransferencia();
    }
  };

  return (
    <>
      <button
        type="button"
        className="w-full border border-base-content/15 bg-base-100 hover:border-primary/50 transition-colors text-left group"
        onClick={() => setAbierto(true)}
      >
        {/* La banda viva: este acceso está activo y puede seguir circulando. */}
        <div className="aguayo" />
        <div className="p-4 flex items-center justify-between gap-3">
          <div>
            <span className="block text-sm font-medium">Pasar mi acceso</span>
            <span className="block text-xs text-base-content/50 mt-0.5">Como se presta un libro</span>
          </div>
          <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
        </div>
      </button>

      {abierto && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-base-100 border border-base-content/15 p-0 max-w-md">
            {/* Mientras la transferencia está en vuelo, la banda avanza. */}
            <div className={`aguayo ${isPending ? "aguayo-animado" : ""}`} />

            <div className="p-6">
              <h3 className="font-display text-2xl m-0">Pasar tu acceso</h3>

              <p className="text-sm text-base-content/70 mt-3 mb-5">
                Vas a pasarle tu acceso a <span className="text-base-content">{curso.titulo}</span> a otra persona.
              </p>

              <div className="border border-warning/35 bg-warning/10 p-3 mb-5">
                <p className="text-sm m-0 leading-relaxed">
                  Tú perderás el acceso. Solo una persona puede tenerlo a la vez.
                </p>
              </div>

              <label className="block text-xs uppercase tracking-[0.14em] text-base-content/50 mb-2">
                ¿A quién se lo pasas?
              </label>
              <AddressInput value={destino} onChange={setDestino} placeholder="0x… o nombre.eth" />

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  className="btn btn-ghost flex-1"
                  disabled={isPending}
                  onClick={() => setAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary flex-1"
                  disabled={isPending || !destino}
                  onClick={manejarTransferencia}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Pasando…
                    </>
                  ) : (
                    "Pasar acceso"
                  )}
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className={`modal-backdrop ${isPending ? "pointer-events-none" : ""}`}>
            <button type="button" onClick={() => setAbierto(false)}>
              cerrar
            </button>
          </form>
        </dialog>
      )}
    </>
  );
};
