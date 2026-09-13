"use client";

import { TarjetaCompartir } from "./TarjetaCompartir";
import { Address } from "@scaffold-ui/components";
import { useAccount } from "wagmi";
import { useLinajeAcceso } from "~~/hooks/useLinajeAcceso";

type Props = {
  lockKey: string;
  tokenId: bigint | undefined;
  titulo: string;
  creador: string;
};

/**
 * La cadena de manos por las que ha pasado un acceso.
 *
 * Se reconstruye desde los eventos del contrato. Es la prueba visible de lo
 * que ninguna plataforma de cursos puede ofrecer: saber a quién le prestaste
 * tu acceso, y a quién se lo prestó esa persona después.
 */
export const LinajeAcceso = ({ lockKey, tokenId, titulo, creador }: Props) => {
  const { address } = useAccount();
  const { pasos, vecesPasado, personas, isLoading } = useLinajeAcceso(lockKey, tokenId);

  if (isLoading) {
    return (
      <div className="border border-base-content/10 bg-base-100 p-5">
        <div className="skeleton h-4 w-40 mb-4" />
        <div className="skeleton h-12 w-full" />
      </div>
    );
  }

  if (pasos.length === 0) return null;

  const esTuyo = (dir: string) => address && dir.toLowerCase() === address.toLowerCase();

  return (
    <div className="border border-base-content/10 bg-base-100 overflow-hidden">
      <div className="aguayo" />

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="text-xs uppercase tracking-[0.14em] text-base-content/50 m-0">Historia de este acceso</h3>
          <span className="dato text-base-content/40">{personas} personas</span>
        </div>

        {/* El titular: lo que ninguna otra plataforma puede decir */}
        <p className="font-display text-2xl leading-tight m-0 mb-5">
          {vecesPasado === 0 ? (
            <>Todavía no ha cambiado de manos</>
          ) : (
            <>
              Ya pasó por{" "}
              <span className="text-primary">{vecesPasado === 1 ? "una mano" : `${vecesPasado} manos`}</span>
            </>
          )}
        </p>

        {/* La cadena */}
        <ol className="relative m-0 p-0 list-none">
          {pasos.map((paso, i) => {
            const ultimo = i === pasos.length - 1;
            return (
              <li key={paso.hash + i} className="relative pl-7 pb-5 last:pb-0">
                {/* Hilo que conecta los nudos, como un quipu */}
                {!ultimo && <span className="absolute left-[5px] top-3 bottom-0 w-px bg-base-content/15" />}

                {/* El nudo */}
                <span
                  className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 ${
                    paso.esCompra
                      ? "bg-base-100 border-base-content/30"
                      : ultimo
                        ? "bg-primary border-primary"
                        : "bg-accent border-accent"
                  }`}
                />

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-xs text-base-content/45">{paso.esCompra ? "Lo compró" : "Pasó a"}</span>
                  <Address address={paso.hacia} size="xs" />
                  {esTuyo(paso.hacia) && ultimo && (
                    <span className="text-[11px] text-primary border border-primary/35 px-1.5 py-0.5 leading-none">
                      tú
                    </span>
                  )}
                </div>

                <span className="dato text-[11px] text-base-content/35 block mt-1">
                  bloque {paso.bloque.toString()}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-5 pt-4 border-t border-base-content/10">
          {vecesPasado > 0 && (
            <p className="text-xs text-base-content/50 leading-relaxed mb-4">
              Ninguna plataforma de cursos sabe a quién le prestaste tu acceso. Aquí la cadena completa vive en la
              blockchain.
            </p>
          )}

          <TarjetaCompartir titulo={titulo} creador={creador} vecesPasado={vecesPasado} personas={personas} />
        </div>
      </div>
    </div>
  );
};
