"use client";

import Link from "next/link";
import { EstadoMembresia } from "./EstadoMembresia";
import { ModalTransferir } from "./ModalTransferir";
import { PrestamosHechos } from "./PrestamosHechos";
import { Address } from "@scaffold-ui/components";
import { useMembresia } from "~~/hooks/useMembresia";
import { usePrestamos } from "~~/hooks/usePrestamos";
import type { Curso } from "~~/types/curso";

type Props = {
  curso: Curso;
};

export const TarjetaAcceso = ({ curso }: Props) => {
  const {
    estado,
    tieneAcceso,
    puedeMover,
    prestadoPor,
    diasRestantes,
    tokenId,
    lockAddress,
    chainId,
    isLoading,
    refetch,
  } = useMembresia(curso.lockKey);
  const { prestamos, recuperar, isPending: recuperando } = usePrestamos(curso.lockKey);

  const hayPrestamos = prestamos.length > 0;

  // Mientras carga, `estado` también es "sin-acceso": sin la guarda de
  // isLoading la tarjeta desaparecería y reaparecería. Un acceso prestado
  // también cuenta como tuyo: no lo tienes, pero puedes recuperarlo.
  if (estado === "sin-acceso" && !isLoading && !hayPrestamos) return null;

  const manejarRecuperar = async (id: bigint) => {
    const exitosa = await recuperar(id);
    if (exitosa) refetch();
  };

  return (
    <div className="bg-base-100 border border-base-content/10">
      <div className={`aguayo ${tieneAcceso ? "" : "aguayo-apagado"}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl font-display leading-tight m-0">{curso.titulo}</h2>
          {isLoading ? (
            <div className="skeleton h-5 w-16 shrink-0" />
          ) : hayPrestamos && !tieneAcceso ? (
            <span className="inline-flex items-center gap-1.5 shrink-0 text-[11px] text-primary border border-primary/35 bg-primary/10 px-2 py-1 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Prestado
            </span>
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

        {tieneAcceso && prestadoPor && (
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-base-content/55 mb-4">
            <span>Te lo prestó</span>
            <Address address={prestadoPor} size="xs" />
          </div>
        )}

        {hayPrestamos && (
          <div className="mb-4">
            <PrestamosHechos
              prestamos={prestamos}
              chainId={chainId}
              tieneAcceso={tieneAcceso}
              recuperando={recuperando}
              onRecuperar={manejarRecuperar}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {(tieneAcceso || estado === "vencido") && (
            <Link href={`/curso/${curso.slug}`} className="btn btn-primary btn-sm w-full">
              {tieneAcceso ? "Ver curso" : "Renovar acceso"}
            </Link>
          )}

          {puedeMover && (
            <ModalTransferir
              curso={curso}
              lockAddress={lockAddress}
              chainId={chainId}
              tokenId={tokenId}
              onTransferencia={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};
