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

  // Mientras carga, `estado` también es "sin-acceso": sin la guarda de
  // isLoading la tarjeta desaparecería y reaparecería.
  if (estado === "sin-acceso" && !isLoading) return null;

  return (
    <div className="bg-base-100 border border-base-content/10">
      <div className={`aguayo ${tieneAcceso ? "" : "aguayo-apagado"}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl font-display leading-tight m-0">{curso.titulo}</h2>
          {isLoading ? (
            <div className="skeleton h-5 w-16 shrink-0" />
          ) : (
            <EstadoMembresia estado={estado} diasRestantes={diasRestantes} compacto />
          )}
        </div>

        <p className="text-xs text-base-content/50 mb-4">
          {curso.creador.nombre} · {curso.creador.ciudad}
        </p>

        {tieneAcceso && diasRestantes !== undefined && (
          <p className="dato text-base-content/55 mb-4">Vence en {diasRestantes} días</p>
        )}

        <div className="flex flex-col gap-2">
          <Link href={`/curso/${curso.slug}`} className="btn btn-primary btn-sm w-full">
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
