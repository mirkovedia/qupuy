"use client";

type Props = {
  /** Sin src, la clase todavía se está pidiendo al servidor (o falló). */
  src?: string;
  titulo: string;
  esVistaPrevia?: boolean;
  hayError?: boolean;
  onReintentar?: () => void;
};

/**
 * Reproductor de la clase activa.
 *
 * `key={src}` fuerza el remontaje al cambiar de clase: sin él, algunos
 * navegadores no recargan el archivo al reemplazar solo el atributo `src`.
 */
export const ReproductorVideo = ({ src, titulo, esVistaPrevia = false, hayError = false, onReintentar }: Props) => (
  <div className="w-full">
    <div className="relative bg-base-300 border border-base-content/10 overflow-hidden">
      {src ? (
        <video
          key={src}
          src={src}
          controls
          playsInline
          preload="metadata"
          className="w-full aspect-video"
          aria-label={titulo}
        />
      ) : (
        <div className="w-full aspect-video flex items-center justify-center" aria-live="polite">
          {hayError ? (
            <div className="text-center px-6">
              <p className="text-sm text-base-content/70 m-0 mb-3">No se pudo obtener esta clase.</p>
              <button type="button" className="btn btn-sm btn-outline" onClick={onReintentar}>
                Reintentar
              </button>
            </div>
          ) : (
            <span className="loading loading-spinner loading-md text-base-content/40" aria-label="Cargando la clase" />
          )}
        </div>
      )}
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
