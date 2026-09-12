"use client";

import type { Modulo } from "~~/types/curso";

const formatearDuracion = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${minutos}:${resto.toString().padStart(2, "0")}`;
};

type Props = {
  modulos: Modulo[];
  tieneAcceso: boolean;
  moduloActivoId: string;
  onSeleccionar: (modulo: Modulo) => void;
};

export const ListaModulos = ({ modulos, tieneAcceso, moduloActivoId, onSeleccionar }: Props) => {
  const indiceActivo = modulos.findIndex(m => m.id === moduloActivoId);
  const desbloqueados = modulos.filter(m => tieneAcceso || m.esGratuito).length;

  return (
    <div className="bg-base-200 rounded-box overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-baseline justify-between">
        <span className="font-semibold">Contenido del curso</span>
        <span className="text-xs text-base-content/60">
          {desbloqueados} de {modulos.length} disponibles
        </span>
      </div>

      <ul className="menu w-full">
        {modulos.map((modulo, indice) => {
          const desbloqueado = tieneAcceso || modulo.esGratuito;
          const esActivo = modulo.id === moduloActivoId;

          return (
            <li key={modulo.id}>
              <button
                type="button"
                disabled={!desbloqueado}
                onClick={() => onSeleccionar(modulo)}
                aria-current={esActivo ? "true" : undefined}
                className={`flex justify-between ${
                  esActivo ? "bg-primary text-primary-content font-medium" : ""
                } ${desbloqueado ? "" : "opacity-60 cursor-not-allowed"}`}
              >
                <span className="flex gap-3 items-center text-left">
                  <span className={esActivo ? "" : "text-base-content/50"}>{esActivo ? "▶" : `${indice + 1}.`}</span>
                  <span>{modulo.titulo}</span>
                </span>
                <span className="flex gap-2 items-center shrink-0">
                  <span className={`text-xs ${esActivo ? "" : "text-base-content/60"}`}>
                    {formatearDuracion(modulo.duracionSegundos)}
                  </span>
                  {desbloqueado ? (
                    modulo.esGratuito && !tieneAcceso ? (
                      <span className="badge badge-outline badge-xs">gratis</span>
                    ) : null
                  ) : (
                    <span aria-label="Bloqueado">🔒</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {desbloqueados > 1 && (
        <div className="flex gap-2 p-3 pt-1">
          <button
            type="button"
            className="btn btn-sm btn-ghost flex-1"
            disabled={indiceActivo <= 0}
            onClick={() => onSeleccionar(modulos[indiceActivo - 1])}
          >
            ← Anterior
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost flex-1"
            disabled={indiceActivo < 0 || indiceActivo >= desbloqueados - 1}
            onClick={() => onSeleccionar(modulos[indiceActivo + 1])}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
