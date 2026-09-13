"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Pantalla del receptor.
 *
 * Para recibir un acceso hace falta una dirección, y pedírsela a alguien por
 * mensaje rompe el caso de uso real: dos personas que están juntas. Aquí el
 * receptor conecta su wallet y su pantalla muestra un QR; quien pasa el acceso
 * lo escanea y la dirección se rellena sola.
 */
export const PantallaRecibir = () => {
  const { address } = useAccount();

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
                Quien te pasa el curso escanea este código desde su pantalla. No hace falta que le dictes tu dirección
                ni se la envíes por mensaje.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/" className="dato text-base-content/40 hover:text-base-content/70 transition-colors">
          ← Ver el catálogo
        </Link>
      </div>
    </div>
  );
};
