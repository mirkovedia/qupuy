"use client";

type Props = {
  src: string;
  titulo: string;
  esVistaPrevia?: boolean;
};

/**
 * Reproductor de la clase activa.
 *
 * Acepta tanto video (mp4, webm) como imagen animada (gif). El contenido de
 * demostración son GIF porque pesan dos órdenes de magnitud menos que un MP4
 * equivalente, lo que mantiene el despliegue ligero y la carga instantánea.
 * Sustituirlos por video real solo requiere cambiar la extensión en los datos.
 */
const esAnimacion = (src: string) => /\.(gif|webp|png|jpe?g)$/i.test(src);

export const ReproductorVideo = ({ src, titulo, esVistaPrevia = false }: Props) => (
  <div className="w-full">
    {esAnimacion(src) ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key={src} src={src} alt={titulo} className="w-full rounded-box bg-base-300 aspect-video object-cover" />
    ) : (
      <video key={src} src={src} controls className="w-full rounded-box bg-base-300 aspect-video" aria-label={titulo} />
    )}
    <div className="flex items-center justify-between mt-2">
      <p className="font-medium">{titulo}</p>
      {esVistaPrevia && <span className="badge badge-outline badge-sm">Vista previa gratuita</span>}
    </div>
  </div>
);
