"use client";

import Link from "next/link";
import { EstadoMembresia } from "./EstadoMembresia";
import { ModalTransferir } from "./ModalTransferir";
import { useMembresia } from "~~/hooks/useMembresia";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
};

export const TarjetaAcceso = ({ curso }: Props) => {
  const { estado, tieneAcceso, diasRestantes, tokenId, lockAddress, isLoading, refetch } = useMembresia(curso.lockKey);

  // No retornar null mientras está cargando para evitar que la tarjeta desaparezca
  // y reaparezca momentáneamente. Si el usuario no tiene acceso y ya terminó de cargar,
  // entonces sí ocultarla.
  if (estado === "sin-acceso" && !isLoading) return null;

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="card-title">{curso.titulo}</h2>
          {isLoading ? (
            <div className="skeleton h-5 w-24" />
          ) : (
            <EstadoMembresia estado={estado} diasRestantes={diasRestantes} />
          )}
        </div>

        <p className="text-sm text-base-content/70">
          {curso.creador.nombre} · {curso.creador.ciudad}
        </p>

        <div className="card-actions mt-3 flex-col gap-2">
          <Link href={`/curso/${curso.slug}`} className="btn btn-primary w-full">
            {tieneAcceso ? "Ver curso" : "Volver a desbloquear"}
          </Link>

          {tieneAcceso && (
            <ModalTransferir curso={curso} lockAddress={lockAddress} tokenId={tokenId} onTransferencia={refetch} />
          )}
        </div>
      </div>
    </div>
  );
};
