"use client";

type Props = {
  src: string;
  titulo: string;
  esVistaPrevia?: boolean;
};

export const ReproductorVideo = ({ src, titulo, esVistaPrevia = false }: Props) => (
  <div className="w-full">
    <video key={src} src={src} controls className="w-full rounded-box bg-base-300 aspect-video" aria-label={titulo} />
    <div className="flex items-center justify-between mt-2">
      <p className="font-medium">{titulo}</p>
      {esVistaPrevia && <span className="badge badge-outline badge-sm">Vista previa gratuita</span>}
    </div>
  </div>
);
