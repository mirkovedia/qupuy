"use client";

import { TarjetaCompartir } from "./TarjetaCompartir";
import { Address } from "@scaffold-ui/components";
import { useAccount } from "wagmi";
import { useLinajeAcceso } from "~~/hooks/useLinajeAcceso";

type Props = {
  lockKey: string;
  /** Sin él se muestra la actividad del curso; con él, el recorrido de ese acceso. */
  tokenId?: bigint;
  titulo: string;
  creador: string;
};

/**
 * La cadena de manos por las que ha pasado un acceso.
 *
 * Quien tiene el acceso ve su propio recorrido. Quien no lo tiene ve la
 * actividad del curso: cuántos se vendieron y cuántas veces circularon. Eso
 * último importa porque es la prueba del producto, y esconderla tras la compra
 * la dejaría invisible justo para quien está decidiendo.
 */
export const LinajeAcceso = ({ lockKey, tokenId, titulo, creador }: Props) => {
  const { address } = useAccount();
  const { pasos, vecesPasado, compras, personas, esDelCurso, isLoading, hayError, reintentar } = useLinajeAcceso(
    lockKey,
    tokenId,
  );

  const encabezado = esDelCurso ? "Actividad del curso" : "Historia de este acceso";

  if (isLoading) {
    return (
      <div className="border border-base-content/10 bg-base-100 p-5">
        <div className="skeleton h-4 w-40 mb-4" />
        <div className="skeleton h-12 w-full" />
      </div>
    );
  }

  // Si el nodo no pudo devolver los eventos, se dice: la sección
  // diferenciadora no puede desaparecer sin explicación.
  if (hayError) {
    return (
      <div className="border border-base-content/10 bg-base-100 overflow-hidden">
        <div className="aguayo aguayo-apagado" />
        <div className="p-5">
          <h3 className="text-xs uppercase tracking-[0.14em] text-base-content/50 m-0 mb-4">{encabezado}</h3>
          {esDelCurso && compras > 0 && (
            <p className="font-display text-2xl leading-tight m-0 mb-3">
              {compras} {compras === 1 ? "acceso vendido" : "accesos vendidos"}
            </p>
          )}
          <p className="text-sm text-base-content/60 leading-relaxed m-0 mb-4">
            No se pudo leer la historia desde la blockchain en este momento.
          </p>
          <button type="button" className="btn btn-sm btn-outline w-full" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (pasos.length === 0) return null;

  const esTuyo = (dir: string) => address && dir.toLowerCase() === address.toLowerCase();

  // A un visitante le interesa el volumen; a quien ya lo tiene, su recorrido.
  const titular = esDelCurso ? (
    vecesPasado === 0 ? (
      <>
        {compras} {compras === 1 ? "acceso vendido" : "accesos vendidos"}
      </>
    ) : (
      <>
        Ya circuló <span className="text-primary">{vecesPasado === 1 ? "una vez" : `${vecesPasado} veces`}</span>
      </>
    )
  ) : vecesPasado === 0 ? (
    <>Todavía no ha cambiado de manos</>
  ) : (
    <>
      Ya pasó por <span className="text-primary">{vecesPasado === 1 ? "una mano" : `${vecesPasado} manos`}</span>
    </>
  );

  return (
    <div className="border border-base-content/10 bg-base-100 overflow-hidden">
      <div className="aguayo" />

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="text-xs uppercase tracking-[0.14em] text-base-content/50 m-0">{encabezado}</h3>
          <span className="dato text-base-content/40">
            {personas} {personas === 1 ? "persona" : "personas"}
          </span>
        </div>

        <p className="font-display text-2xl leading-tight m-0 mb-5">{titular}</p>

        <ol className="relative m-0 p-0 list-none">
          {pasos.slice(-6).map((paso, i, visibles) => {
            const ultimo = i === visibles.length - 1;
            return (
              <li key={paso.hash + i} className="relative pl-7 pb-5 last:pb-0">
                {/* Hilo que conecta los nudos, como un quipu */}
                {!ultimo && <span className="absolute left-[5px] top-3 bottom-0 w-px bg-base-content/15" />}

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
                  {esTuyo(paso.hacia) && (
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
          <p className="text-xs text-base-content/50 leading-relaxed mb-4">
            Ninguna plataforma de cursos sabe a quién le prestaste tu acceso. Aquí la cadena completa vive en la
            blockchain.
          </p>

          {!esDelCurso && (
            <TarjetaCompartir titulo={titulo} creador={creador} vecesPasado={vecesPasado} personas={personas} />
          )}
        </div>
      </div>
    </div>
  );
};
