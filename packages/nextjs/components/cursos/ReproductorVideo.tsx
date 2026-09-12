"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  titulo: string;
  esVistaPrevia?: boolean;
  /** Número de diapositivas de la clase. Si es 0, `src` se trata como archivo de video. */
  diapositivas?: number;
};

/** Segundos que se muestra cada diapositiva cuando la reproducción está activa. */
const SEGUNDOS_POR_DIAPOSITIVA = 9;

const esArchivoDeVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);

/**
 * Reproductor de la clase activa.
 *
 * Las clases del curso son secuencias de diapositivas, no archivos de video, así
 * que el reproductor es propio: avanza solo, se puede pausar, permite saltar a
 * cualquier punto y muestra el progreso. Da más control que un `<video>` sobre
 * contenido estático, donde arrastrar la barra no aporta nada.
 *
 * Si `src` apunta a un archivo de video (.mp4, .webm), se usa el elemento
 * `<video>` nativo con sus controles.
 */
export const ReproductorVideo = ({ src, titulo, esVistaPrevia = false, diapositivas = 0 }: Props) => {
  const [actual, setActual] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(true);
  const [progreso, setProgreso] = useState(0);
  const intervalo = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Al cambiar de clase, volver al principio.
  useEffect(() => {
    setActual(0);
    setProgreso(0);
    setReproduciendo(true);
  }, [src]);

  useEffect(() => {
    if (!reproduciendo || diapositivas === 0) return;

    const paso = 100 / (SEGUNDOS_POR_DIAPOSITIVA * 10);
    intervalo.current = setInterval(() => {
      setProgreso(anterior => {
        if (anterior + paso < 100) return anterior + paso;
        setActual(i => (i + 1) % diapositivas);
        return 0;
      });
    }, 100);

    return () => clearInterval(intervalo.current);
  }, [reproduciendo, diapositivas]);

  if (diapositivas === 0 || esArchivoDeVideo(src)) {
    return (
      <div className="w-full">
        <video
          key={src}
          src={src}
          controls
          className="w-full rounded-box bg-base-300 aspect-video"
          aria-label={titulo}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="font-medium">{titulo}</p>
          {esVistaPrevia && <span className="badge badge-outline badge-sm">Vista previa gratuita</span>}
        </div>
      </div>
    );
  }

  const irA = (indice: number) => {
    setActual(Math.max(0, Math.min(indice, diapositivas - 1)));
    setProgreso(0);
  };

  const segundosTranscurridos = Math.round(
    actual * SEGUNDOS_POR_DIAPOSITIVA + (progreso / 100) * SEGUNDOS_POR_DIAPOSITIVA,
  );
  const segundosTotales = diapositivas * SEGUNDOS_POR_DIAPOSITIVA;

  const formatear = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="w-full">
      <div className="relative rounded-box overflow-hidden bg-base-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${src}/d${actual.toString().padStart(2, "0")}.png`}
          alt={`${titulo} — diapositiva ${actual + 1} de ${diapositivas}`}
          className="w-full aspect-video object-contain"
        />

        {/* Barra de progreso de la diapositiva actual */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-base-100/30">
          <div className="h-full bg-primary transition-[width] duration-100" style={{ width: `${progreso}%` }} />
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost"
          onClick={() => irA(actual - 1)}
          disabled={actual === 0}
          aria-label="Diapositiva anterior"
        >
          ⏮
        </button>

        <button
          type="button"
          className="btn btn-sm btn-circle btn-primary"
          onClick={() => setReproduciendo(r => !r)}
          aria-label={reproduciendo ? "Pausar" : "Reproducir"}
        >
          {reproduciendo ? "❚❚" : "▶"}
        </button>

        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost"
          onClick={() => irA(actual + 1)}
          disabled={actual === diapositivas - 1}
          aria-label="Diapositiva siguiente"
        >
          ⏭
        </button>

        <span className="text-xs text-base-content/70 tabular-nums">
          {formatear(segundosTranscurridos)} / {formatear(segundosTotales)}
        </span>

        {/* Marcadores de diapositiva: clicables para saltar */}
        <div className="flex gap-1 flex-1 justify-end">
          {Array.from({ length: diapositivas }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === actual ? "w-6 bg-primary" : "w-3 bg-base-content/25 hover:bg-base-content/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="font-medium">{titulo}</p>
        {esVistaPrevia && <span className="badge badge-outline badge-sm">Vista previa gratuita</span>}
      </div>
    </div>
  );
};
