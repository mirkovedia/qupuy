"use client";

import { useState } from "react";
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
      <div className="container mx-auto px-4 py-10">
        <div className="skeleton h-8 w-72 mb-4" />
        <div className="skeleton aspect-video w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">{curso.titulo}</h1>
          <EstadoMembresia estado={estado} diasRestantes={diasRestantes} />
        </div>
        <p className="text-base-content/70 mt-1">
          Por {curso.creador.nombre} · {curso.creador.ciudad}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <ReproductorVideo
            src={moduloReproducible.videoUrl}
            titulo={moduloReproducible.titulo}
            esVistaPrevia={!tieneAcceso}
            diapositivas={moduloReproducible.diapositivas ?? 0}
          />
          <p>{curso.descripcion}</p>
        </div>

        <aside className="space-y-6">
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
