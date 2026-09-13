"use client";

import { useEffect, useRef, useState } from "react";
import { isAddress } from "viem";

type Props = {
  onDireccion: (direccion: string) => void;
  onCerrar: () => void;
};

/** La API de detección de códigos del navegador, aún sin tipos en el DOM. */
type DetectorCodigos = {
  detect: (fuente: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};

/** Si el navegador puede leer códigos. Solo Chrome y derivados, a día de hoy. */
export const puedeEscanear = () => typeof globalThis !== "undefined" && "BarcodeDetector" in globalThis;

const crearDetector = (): DetectorCodigos | null => {
  const api = (globalThis as { BarcodeDetector?: new (opciones: { formats: string[] }) => DetectorCodigos })
    .BarcodeDetector;
  if (!api) return null;
  try {
    return new api({ formats: ["qr_code"] });
  } catch {
    return null;
  }
};

/**
 * Lee una dirección desde el QR que muestra el receptor en su pantalla.
 *
 * Usa la API de detección del propio navegador, sin dependencias. Donde no
 * exista, el modal de transferencia sigue aceptando la dirección escrita a
 * mano: el escáner acelera el caso presencial, no lo sustituye.
 */
export const EscanerDireccion = ({ onDireccion, onCerrar }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>();

  // El callback vive en una ref para que el efecto arranque la cámara una
  // sola vez: si dependiera de `onDireccion`, cada render del padre la
  // reiniciaría, con parpadeo y nueva petición de permiso.
  const onDireccionRef = useRef(onDireccion);
  useEffect(() => {
    onDireccionRef.current = onDireccion;
  }, [onDireccion]);

  useEffect(() => {
    const detector = crearDetector();
    if (!detector) {
      setError("camara-no-soportada");
      return;
    }

    let stream: MediaStream | undefined;
    let temporizador: ReturnType<typeof setInterval> | undefined;
    let cancelado = false;

    const arrancar = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelado || !videoRef.current) return;

        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        temporizador = setInterval(async () => {
          if (!videoRef.current) return;
          try {
            const codigos = await detector.detect(videoRef.current);
            const encontrada = codigos.map(c => c.rawValue.trim()).find(v => isAddress(v));
            if (encontrada) {
              clearInterval(temporizador);
              onDireccionRef.current(encontrada);
            }
          } catch {
            // Un fotograma ilegible no es un fallo: se reintenta en el siguiente.
          }
        }, 350);
      } catch {
        if (!cancelado) setError("permiso-denegado");
      }
    };

    void arrancar();

    return () => {
      cancelado = true;
      if (temporizador) clearInterval(temporizador);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="border border-base-content/15 bg-base-100 overflow-hidden">
      <div className="aguayo" />

      <div className="p-5">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-xs uppercase tracking-[0.14em] text-base-content/50">Escanear código</span>
          <button type="button" className="dato text-base-content/40 hover:text-base-content" onClick={onCerrar}>
            cerrar
          </button>
        </div>

        {error ? (
          <div>
            <p className="text-sm text-base-content/70 m-0 mb-2">
              {error === "camara-no-soportada"
                ? "Este navegador no puede leer códigos. Chrome sí puede."
                : "No se pudo abrir la cámara. Revisa los permisos del navegador."}
            </p>
            <p className="text-sm text-base-content/55 m-0 mb-4">
              También puedes pedirle su dirección y pegarla en el campo.
            </p>
            <button type="button" className="btn btn-sm btn-outline w-full" onClick={onCerrar}>
              Escribir la dirección
            </button>
          </div>
        ) : (
          <>
            <div className="relative bg-base-300 overflow-hidden">
              <video ref={videoRef} playsInline muted className="w-full aspect-square object-cover" />
              {/* Marco de encuadre */}
              <div className="absolute inset-8 border-2 border-primary/70 pointer-events-none" />
            </div>
            <p className="text-sm text-base-content/60 leading-relaxed mt-4 mb-0">
              Apunta a la pantalla de quien va a recibir el acceso.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
