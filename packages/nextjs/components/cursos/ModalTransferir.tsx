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
      <button type="button" className="btn btn-outline w-full" onClick={() => setAbierto(true)}>
        Pasar mi acceso a alguien →
      </button>

      {abierto && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Pasar tu acceso</h3>

            <p className="py-3">
              Vas a pasarle tu acceso a <strong>{curso.titulo}</strong> a otra persona.
            </p>

            <div className="alert alert-warning">
              <span>Tú perderás el acceso. Solo una persona puede tenerlo a la vez.</span>
            </div>

            <div className="py-4">
              <label className="label">
                <span className="label-text">¿A quién se lo pasas?</span>
              </label>
              <AddressInput value={destino} onChange={setDestino} placeholder="0x… o nombre.eth" />
            </div>

            <div className="modal-action">
              <button type="button" className="btn btn-ghost" disabled={isPending} onClick={() => setAbierto(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={isPending || !destino}
                onClick={manejarTransferencia}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner" />
                    Pasando…
                  </>
                ) : (
                  "Pasar acceso"
                )}
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setAbierto(false)}>
              cerrar
            </button>
          </form>
        </dialog>
      )}
    </>
  );
};
