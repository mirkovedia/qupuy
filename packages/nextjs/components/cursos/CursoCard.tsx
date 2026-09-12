"use client";

import Link from "next/link";
import { EstadoMembresia } from "./EstadoMembresia";
import { useMembresia } from "~~/hooks/useMembresia";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
};

export const CursoCard = ({ curso }: Props) => {
  const { estado, tieneAcceso, diasRestantes, isLoading } = useMembresia(curso.lockKey);
  const modulos = curso.modulos.length;

  return (
    <Link
      href={`/curso/${curso.slug}`}
      className="group flex flex-col bg-base-100 border border-base-content/10 hover:border-base-content/25 transition-colors"
    >
      {/* La banda cobra color cuando tienes el acceso. */}
      <div className={`aguayo ${tieneAcceso ? "" : "aguayo-apagado"}`} />

      <div className="p-5 flex flex-col grow">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl font-display leading-tight m-0 group-hover:text-primary transition-colors">
            {curso.titulo}
          </h2>
          {isLoading ? (
            <div className="skeleton h-5 w-16 shrink-0" />
          ) : (
            <EstadoMembresia estado={estado} diasRestantes={diasRestantes} compacto />
          )}
        </div>

        <p className="text-xs text-base-content/50 mb-3">
          {curso.creador.nombre} · {curso.creador.ciudad}
        </p>

        <p className="text-sm text-base-content/70 leading-relaxed line-clamp-2 grow m-0">{curso.descripcion}</p>

        <div className="flex items-baseline justify-between mt-5 pt-4 border-t border-base-content/10">
          <span className="font-display text-2xl leading-none">
            Bs {curso.precioBs}
            <span className="dato text-base-content/40 ml-2 text-xs">/ {curso.duracionDias} días</span>
          </span>
          <span className="dato text-base-content/40">{modulos} clases</span>
        </div>
      </div>
    </Link>
  );
};
