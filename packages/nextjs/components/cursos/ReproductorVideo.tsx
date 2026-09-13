"use client";

type Props = {
  src: string;
  titulo: string;
  esVistaPrevia?: boolean;
};

/**
 * Reproductor de la clase activa.
 *
 * `key={src}` fuerza el remontaje al cambiar de clase: sin él, algunos
 * navegadores no recargan el archivo al reemplazar solo el atributo `src`.
 */
export const ReproductorVideo = ({ src, titulo, esVistaPrevia = false }: Props) => (
  <div className="w-full">
    <div className="relative bg-base-300 border border-base-content/10 overflow-hidden">
      <video
        key={src}
        src={src}
        controls
        playsInline
        preload="metadata"
        className="w-full aspect-video"
        aria-label={titulo}
      />
      {esVistaPrevia && (
        <span className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.14em] bg-base-100/90 text-base-content/80 px-2 py-1 leading-none pointer-events-none">
          Vista previa
        </span>
      )}
    </div>

    <div className="flex items-baseline justify-between gap-4 mt-4">
      <h2 className="text-lg font-display m-0">{titulo}</h2>
      {esVistaPrevia && <span className="dato text-base-content/40 shrink-0">clase gratuita</span>}
    </div>
  </div>
);
