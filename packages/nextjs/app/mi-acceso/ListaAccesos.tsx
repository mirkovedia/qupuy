"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { TarjetaAcceso } from "~~/components/cursos/TarjetaAcceso";
import type { Curso } from "~~/types/curso";

type Props = {
  cursos: Curso[];
};

export const ListaAccesos = ({ cursos }: Props) => {
  const { address } = useAccount();

  if (!address) {
    return (
      <div className="alert alert-info">
        <span>Conecta tu wallet para ver tus accesos.</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursos.map(curso => (
          <TarjetaAcceso key={curso.id} curso={curso} />
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-base-content/70 mb-3">Los cursos que desbloquees aparecerán aquí.</p>
        <Link href="/" className="btn btn-outline">
          Ver todos los cursos
        </Link>
      </div>
    </>
  );
};
