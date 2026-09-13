"use client";

import Link from "next/link";
import { AvisoRed } from "./AvisoRed";
import type { Address } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useComprarAcceso } from "~~/hooks/useComprarAcceso";
import { useRedDelLock } from "~~/hooks/useRedDelLock";
import type { Curso } from "~~/types/curso";
import type { EstadoAcceso } from "~~/utils/membresia";
import type { AllowedChainIds } from "~~/utils/scaffold-eth";

type Props = {
  curso: Curso;
  lockAddress: Address | undefined;
  chainId: AllowedChainIds;
  estado: EstadoAcceso;
  /** Con estado "vencido", la key a renovar. */
  tokenId: bigint | undefined;
  onCompraExitosa: () => void;
};

export const BotonDesbloquear = ({ curso, lockAddress, chainId, estado, tokenId, onCompraExitosa }: Props) => {
  const { address } = useAccount();
  const { enRedCorrecta, nombreRed } = useRedDelLock(chainId);
  const { comprar, isPending, precio, duracionDias, esRenovacion } = useComprarAcceso(
    lockAddress,
    estado === "vencido" ? tokenId : undefined,
  );

  if (!address) {
    return (
      <div className="border border-base-content/15 bg-base-100 p-5">
        <p className="text-sm text-base-content/70 m-0">Conecta tu wallet para desbloquear este curso.</p>
      </div>
    );
  }

  if (!lockAddress) {
    return (
      <div className="border border-base-content/15 bg-base-100 p-5">
        <p className="text-sm text-base-content/70 m-0">Este curso todavía no tiene un Lock en {nombreRed}.</p>
      </div>
    );
  }

  if (!enRedCorrecta) {
    return <AvisoRed chainId={chainId} accion="desbloquear este curso" />;
  }

  const manejarCompra = async () => {
    const exitosa = await comprar();
    if (exitosa) onCompraExitosa();
  };

  return (
    <div className="border border-base-content/15 bg-base-100">
      <div className="aguayo aguayo-apagado" />

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-display text-3xl leading-none">Bs {curso.precioBs}</span>
          <span className="dato text-base-content/45">{duracionDias ?? curso.duracionDias} días</span>
        </div>
        <p className="text-[11px] text-base-content/40 m-0 mb-4">
          precio de referencia · en la demo el Lock cobra {precio !== undefined ? formatEther(precio) : "…"} ETH de
          prueba
        </p>

        {esRenovacion && (
          <p className="text-sm text-base-content/70 leading-relaxed m-0 mb-4">
            Tu acceso venció. Renovarlo cuesta lo mismo y conserva su historia.
          </p>
        )}

        <button
          type="button"
          className="btn btn-primary w-full"
          disabled={isPending || precio === undefined}
          onClick={manejarCompra}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Procesando…
            </>
          ) : esRenovacion ? (
            "Renovar mi acceso"
          ) : (
            "Desbloquear curso completo"
          )}
        </button>

        <div className="mt-4 pt-4 border-t border-base-content/10">
          <p className="text-xs text-base-content/55 leading-relaxed m-0 mb-2">
            Tu acceso es tuyo: al terminar, se lo puedes prestar o regalar a alguien.
          </p>
          <Link href="/recibir" className="text-xs link text-base-content/45">
            ¿Alguien te va a pasar este curso? →
          </Link>
        </div>
      </div>
    </div>
  );
};
