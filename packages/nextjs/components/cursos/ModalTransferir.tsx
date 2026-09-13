"use client";

import { useEffect, useState } from "react";
import { AvisoRed } from "./AvisoRed";
import { EscanerDireccion, puedeEscanear } from "./EscanerDireccion";
import { AddressInput } from "@scaffold-ui/components";
import type { Address } from "viem";
import { useRedDelLock } from "~~/hooks/useRedDelLock";
import { type ModoEntrega, useTransferirAcceso } from "~~/hooks/useTransferirAcceso";
import type { Curso } from "~~/types/curso";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

type Props = {
  curso: Curso;
  lockAddress: Address | undefined;
  chainId: AllowedChainIds;
  tokenId: bigint | undefined;
  onTransferencia: () => void;
};

const MODOS: { valor: ModoEntrega; titulo: string; detalle: string }[] = [
  { valor: "prestar", titulo: "Prestar", detalle: "Lo recuperas cuando quieras" },
  { valor: "regalar", titulo: "Regalar", detalle: "Definitivo: pasa a ser suyo" },
];

export const ModalTransferir = ({ curso, lockAddress, chainId, tokenId, onTransferencia }: Props) => {
  const [abierto, setAbierto] = useState(false);
  const [destino, setDestino] = useState("");
  const [modo, setModo] = useState<ModoEntrega>("prestar");
  const [escaneando, setEscaneando] = useState(false);
  // Solo se ofrece el escaneo donde funciona: un botón que falla al pulsarlo
  // es peor que no ofrecerlo. Se comprueba en un efecto porque la capacidad
  // solo existe en el navegador, y evaluarla durante el render desajustaría
  // la hidratación.
  const [hayCamara, setHayCamara] = useState(false);

  useEffect(() => {
    setHayCamara(puedeEscanear());
  }, []);

  const { transferir, isPending } = useTransferirAcceso(lockAddress, tokenId);
  const { enRedCorrecta } = useRedDelLock(chainId);

  const cerrar = () => {
    if (isPending) return;
    setAbierto(false);
    setEscaneando(false);
  };

  // Escape cierra el modal, como cualquier diálogo.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, isPending]);

  const manejarTransferencia = async () => {
    const exitosa = await transferir(destino as Address, modo);
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
            <span className="block text-xs text-base-content/50 mt-0.5">Préstalo o regálalo, como un libro</span>
          </div>
          <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
        </div>
      </button>

      {abierto && (
        <dialog className="modal modal-open" aria-labelledby="titulo-pasar-acceso">
          <div className="modal-box bg-base-100 border border-base-content/15 p-0 max-w-md">
            {/* Mientras la transferencia está en vuelo, la banda avanza. */}
            <div className={`aguayo ${isPending ? "aguayo-animado" : ""}`} />

            <div className="p-6">
              <h3 id="titulo-pasar-acceso" className="font-display text-2xl m-0">
                Pasar tu acceso
              </h3>

              <p className="text-sm text-base-content/70 mt-3 mb-4">
                Vas a pasarle tu acceso a <span className="text-base-content">{curso.titulo}</span> a otra persona.
              </p>

              <div role="radiogroup" aria-label="Cómo lo pasas" className="grid grid-cols-2 gap-2 mb-4">
                {MODOS.map(opcion => {
                  const activo = modo === opcion.valor;
                  return (
                    <button
                      key={opcion.valor}
                      type="button"
                      role="radio"
                      aria-checked={activo}
                      disabled={isPending}
                      onClick={() => setModo(opcion.valor)}
                      className={`text-left p-3 border transition-colors ${
                        activo ? "border-primary bg-primary/10" : "border-base-content/15 hover:border-base-content/35"
                      }`}
                    >
                      <span className={`block text-sm font-medium ${activo ? "text-primary" : ""}`}>
                        {opcion.titulo}
                      </span>
                      <span className="block text-xs text-base-content/55 mt-0.5">{opcion.detalle}</span>
                    </button>
                  );
                })}
              </div>

              <div className="border border-warning/35 bg-warning/10 p-3 mb-5">
                <p className="text-sm m-0 leading-relaxed">
                  {modo === "prestar"
                    ? "Mientras dure el préstamo, tú no tendrás el acceso y esa persona no podrá pasarlo a nadie. Solo una persona lo tiene a la vez."
                    : "Tú perderás el acceso. Solo una persona puede tenerlo a la vez."}
                </p>
              </div>

              {escaneando ? (
                <EscanerDireccion
                  onDireccion={dir => {
                    setDestino(dir);
                    setEscaneando(false);
                  }}
                  onCerrar={() => setEscaneando(false)}
                />
              ) : (
                <>
                  <label className="block">
                    <span className="block text-xs uppercase tracking-[0.14em] text-base-content/50 mb-2">
                      ¿A quién se lo pasas?
                    </span>
                    <AddressInput value={destino} onChange={setDestino} placeholder="0x… o nombre.eth" />
                  </label>

                  {hayCamara && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm w-full mt-2 gap-2"
                      onClick={() => setEscaneando(true)}
                    >
                      <span aria-hidden>⬚</span>
                      Escanear su código
                    </button>
                  )}

                  <p className="text-xs text-base-content/45 leading-relaxed mt-3 mb-0">
                    Si están juntos, que abra <span className="dato">qupuy.vercel.app/recibir</span>
                    {hayCamara ? " y escanea el código que le aparece." : " y te dicte su dirección."}
                  </p>
                </>
              )}

              {!enRedCorrecta && (
                <div className="mt-5">
                  <AvisoRed chainId={chainId} accion="pasar el acceso" compacto />
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button type="button" className="btn btn-ghost flex-1" disabled={isPending} onClick={cerrar}>
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary flex-1"
                  disabled={isPending || !destino || !enRedCorrecta}
                  onClick={manejarTransferencia}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      {modo === "prestar" ? "Prestando…" : "Pasando…"}
                    </>
                  ) : modo === "prestar" ? (
                    "Prestar acceso"
                  ) : (
                    "Regalar acceso"
                  )}
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className={`modal-backdrop ${isPending ? "pointer-events-none" : ""}`}>
            <button type="button" onClick={cerrar}>
              cerrar
            </button>
          </form>
        </dialog>
      )}
    </>
  );
};
