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

export const ListaModulos = ({ modulos, tieneAcceso, moduloActivoId, onSeleccionar }: Props) => (
  <ul className="menu bg-base-200 rounded-box w-full">
    <li className="menu-title">Contenido del curso</li>
    {modulos.map((modulo, indice) => {
      const desbloqueado = tieneAcceso || modulo.esGratuito;
      const esActivo = modulo.id === moduloActivoId;

      return (
        <li key={modulo.id}>
          <button
            type="button"
            disabled={!desbloqueado}
            onClick={() => onSeleccionar(modulo)}
            className={`flex justify-between ${esActivo ? "active" : ""} ${
              desbloqueado ? "" : "opacity-60 cursor-not-allowed"
            }`}
          >
            <span className="flex gap-3 items-center text-left">
              <span className="text-base-content/50">{indice + 1}.</span>
              <span>{modulo.titulo}</span>
            </span>
            <span className="flex gap-2 items-center shrink-0">
              <span className="text-xs text-base-content/60">{formatearDuracion(modulo.duracionSegundos)}</span>
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
);
