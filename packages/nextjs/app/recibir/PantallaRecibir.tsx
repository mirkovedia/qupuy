"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useAccesosDe } from "~~/hooks/useAccesosDe";
import type { Curso } from "~~/types/curso";

type Props = {
  cursos: Curso[];
};

/**
 * Pantalla del receptor.
 *
 * Para recibir un acceso hace falta una dirección, y pedírsela a alguien por
 * mensaje rompe el caso de uso real: dos personas que están juntas. Aquí el
 * receptor conecta su wallet y su pantalla muestra un QR; quien pasa el acceso
 * lo escanea y la dirección se rellena sola.
 *
 * La pantalla consulta el contrato cada pocos segundos: cuando el acceso
 * llega, cambia sola. El receptor no tiene que recargar ni que nadie le avise.
 */
export const PantallaRecibir = ({ cursos }: Props) => {
  const { address } = useAccount();
  const { conAcceso, recibidos } = useAccesosDe(address, cursos);
  const yaTenia = conAcceso.filter(curso => !recibidos.includes(curso));

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-lg">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-display leading-none m-0">Recibir un acceso</h1>
        <p className="text-base-content/65 mt-4 mb-0">
          Conecta tu wallet y muestra este código a quien te va a pasar el curso.
        </p>
      </header>

      {!address ? (
        <div className="border border-base-content/15 bg-base-100 p-8 text-center">
          <p className="text-base-content/70 mb-6">Primero conecta tu wallet.</p>
          <div className="flex justify-center">
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      ) : (
        <>
          {recibidos.length > 0 && (
            <div className="border border-primary/40 bg-base-100 overflow-hidden mb-6" role="status">
              <div className="aguayo aguayo-animado" />
              <div className="p-6 text-center">
                <p className="text-xs uppercase tracking-[0.14em] text-primary m-0 mb-2">Acaba de llegar</p>
                {recibidos.map(curso => (
                  <div key={curso.slug} className="mb-4 last:mb-0">
                    <p className="font-display text-2xl leading-tight m-0 mb-3">¡Recibiste {curso.titulo}!</p>
                    <Link href={`/curso/${curso.slug}`} className="btn btn-primary btn-sm">
                      Ver el curso →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border border-base-content/15 bg-base-100 overflow-hidden">
            <div className="aguayo" />

            <div className="p-8 flex flex-col items-center">
              {/* El QR sobre fondo claro: los lectores necesitan contraste alto */}
              <div className="bg-white p-5 rounded-sm">
                <QRCodeSVG value={address} size={220} level="M" />
              </div>

              <p className="text-xs uppercase tracking-[0.14em] text-base-content/45 mt-7 mb-2">Tu dirección</p>
              <p className="dato text-center break-all text-base-content/80 m-0">{address}</p>

              <div className="w-full mt-8 pt-6 border-t border-base-content/10">
                <p className="text-sm text-base-content/60 leading-relaxed m-0">
                  Quien te pasa el curso escanea este código desde su pantalla. En cuanto llegue, esta pantalla te lo
                  dirá sola.
                </p>
              </div>

              {yaTenia.length > 0 && (
                <div className="w-full mt-6 pt-5 border-t border-base-content/10">
                  <p className="text-xs uppercase tracking-[0.14em] text-base-content/45 m-0 mb-2">Ya tienes</p>
                  <ul className="m-0 p-0 list-none space-y-1">
                    {yaTenia.map(curso => (
                      <li key={curso.slug}>
                        <Link href={`/curso/${curso.slug}`} className="text-sm link text-base-content/70">
                          {curso.titulo}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="dato text-base-content/40 hover:text-base-content/70 transition-colors">
          ← Ver el catálogo
        </Link>
      </div>
    </div>
  );
};
