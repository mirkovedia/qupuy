"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { AvisoRed } from "~~/components/cursos/AvisoRed";
import { TarjetaAcceso } from "~~/components/cursos/TarjetaAcceso";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useRedDelLock } from "~~/hooks/useRedDelLock";
import type { Curso } from "~~/types/curso";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

type Props = {
  cursos: Curso[];
};

export const ListaAccesos = ({ cursos }: Props) => {
  const { address } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const chainId = targetNetwork.id as AllowedChainIds;
  const { enRedCorrecta } = useRedDelLock(chainId);

  if (!address) {
    return (
      <div className="border border-base-content/15 bg-base-100 p-6">
        <p className="text-base-content/70 m-0">Conecta tu wallet para ver tus accesos.</p>
      </div>
    );
  }

  return (
    <>
      {/* Los accesos se leen igual en cualquier red; moverlos exige la del Lock. */}
      {!enRedCorrecta && (
        <div className="mb-6">
          <AvisoRed chainId={chainId} accion="pasar o recuperar tus accesos" />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursos.map(curso => (
          <TarjetaAcceso key={curso.id} curso={curso} />
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-base-content/70 mb-3">Los cursos que desbloquees aparecerán aquí.</p>
        <Link href="/" className="btn btn-sm btn-outline">
          Ver todos los cursos
        </Link>
      </div>
    </>
  );
};
