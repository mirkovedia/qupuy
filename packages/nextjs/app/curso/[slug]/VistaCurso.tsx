"use client";

import { useState } from "react";
import Link from "next/link";
import { Address } from "@scaffold-ui/components";
import { BotonDesbloquear } from "~~/components/cursos/BotonDesbloquear";
import { EstadoMembresia } from "~~/components/cursos/EstadoMembresia";
import { LinajeAcceso } from "~~/components/cursos/LinajeAcceso";
import { ListaModulos } from "~~/components/cursos/ListaModulos";
import { ModalTransferir } from "~~/components/cursos/ModalTransferir";
import { ReproductorVideo } from "~~/components/cursos/ReproductorVideo";
import { useMembresia } from "~~/hooks/useMembresia";
import type { Curso, Modulo } from "~~/types/curso";

type Props = {
  curso: Curso;
};

export const VistaCurso = ({ curso }: Props) => {
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
  const moduloGratuito = curso.modulos.find(m => m.esGratuito) ?? curso.modulos[0];
  const [moduloActivo, setModuloActivo] = useState<Modulo>(moduloGratuito);

  // El módulo que se puede reproducir: sin acceso, siempre el gratuito.
  const moduloReproducible = tieneAcceso ? moduloActivo : moduloGratuito;

  const seleccionarModulo = (modulo: Modulo) => {
    if (tieneAcceso || modulo.esGratuito) setModuloActivo(modulo);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
        <div className="skeleton h-10 w-80 mb-3" />
        <div className="skeleton h-4 w-48 mb-8" />
        <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <div className="skeleton aspect-video w-full" />
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <Link href="/" className="dato text-base-content/40 hover:text-base-content/70 transition-colors">
        ← Catálogo
      </Link>

      <header className="mt-5 mb-8 pb-6 border-b border-base-content/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display leading-none m-0">{curso.titulo}</h1>
            <p className="text-sm text-base-content/55 mt-3 mb-0">
              {curso.creador.nombre} · {curso.creador.ciudad}
            </p>
          </div>
          <EstadoMembresia estado={estado} diasRestantes={diasRestantes} />
        </div>
      </header>

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1.8fr_1fr] items-start">
        <div>
          <ReproductorVideo
            src={moduloReproducible.videoUrl}
            titulo={moduloReproducible.titulo}
            esVistaPrevia={!tieneAcceso}
          />
          <p className="text-base-content/70 leading-relaxed mt-8">{curso.descripcion}</p>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <ListaModulos
            modulos={curso.modulos}
            tieneAcceso={tieneAcceso}
            moduloActivoId={moduloReproducible.id}
            onSeleccionar={seleccionarModulo}
          />

          {!tieneAcceso && (
            <BotonDesbloquear
              curso={curso}
              lockAddress={lockAddress}
              chainId={chainId}
              estado={estado}
              tokenId={tokenId}
              onCompraExitosa={refetch}
            />
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

          {tieneAcceso && prestadoPor && (
            <div className="border border-base-content/15 bg-base-100 overflow-hidden">
              <div className="aguayo" />
              <div className="p-4">
                <span className="block text-sm font-medium mb-1">Es un préstamo</span>
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-base-content/55">
                  <span>Te lo prestó</span>
                  <Address address={prestadoPor} size="xs" />
                </div>
                <p className="text-xs text-base-content/45 leading-relaxed mt-2 mb-0">
                  Solo esa persona puede moverlo o recuperarlo. Mientras tanto, es tuyo.
                </p>
              </div>
            </div>
          )}

          <LinajeAcceso
            lockKey={curso.lockKey}
            tokenId={tokenId}
            titulo={curso.titulo}
            creador={curso.creador.nombre}
          />
        </aside>
      </div>
    </div>
  );
};
