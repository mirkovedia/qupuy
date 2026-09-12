"use client";

import Link from "next/link";
import { EstadoMembresia } from "./EstadoMembresia";
import { useMembresia } from "~~/hooks/useMembresia";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
};

export const CursoCard = ({ curso }: Props) => {
  const { estado, diasRestantes } = useMembresia(curso.lockKey);

  return (
    <Link href={`/curso/${curso.slug}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <figure className="aspect-video bg-base-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={curso.portadaUrl} alt={curso.titulo} className="w-full h-full object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{curso.titulo}</h2>
        <p className="text-sm text-base-content/70">
          {curso.creador.nombre} · {curso.creador.ciudad}
        </p>
        <p className="text-sm line-clamp-2">{curso.descripcion}</p>
        <div className="card-actions justify-between items-center mt-2">
          <span className="font-bold text-lg">Bs {curso.precioBs}</span>
          <EstadoMembresia estado={estado} diasRestantes={diasRestantes} />
        </div>
      </div>
    </Link>
  );
};
