"use client";

import { useState } from "react";
import Link from "next/link";
import { BotonDesbloquear } from "~~/components/cursos/BotonDesbloquear";
import { EstadoMembresia } from "~~/components/cursos/EstadoMembresia";
import { ListaModulos } from "~~/components/cursos/ListaModulos";
import { ModalTransferir } from "~~/components/cursos/ModalTransferir";
import { ReproductorVideo } from "~~/components/cursos/ReproductorVideo";
import { useMembresia } from "~~/hooks/useMembresia";
import type { Curso, Modulo } from "~~/types/curso";

type Props = {
  curso: Curso;
};

export const VistaCurso = ({ curso }: Props) => {
  const { estado, tieneAcceso, diasRestantes, tokenId, lockAddress, isLoading, refetch } = useMembresia(curso.lockKey);
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
            diapositivas={moduloReproducible.diapositivas ?? 0}
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

          {!tieneAcceso && <BotonDesbloquear curso={curso} lockAddress={lockAddress} onCompraExitosa={refetch} />}

          {tieneAcceso && (
            <ModalTransferir curso={curso} lockAddress={lockAddress} tokenId={tokenId} onTransferencia={refetch} />
          )}
        </aside>
      </div>
    </div>
  );
};
