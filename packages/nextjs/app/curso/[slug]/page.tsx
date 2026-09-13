import { notFound } from "next/navigation";
import { VistaCurso } from "./VistaCurso";
import { contentRepository } from "~~/services/content";
import { ocultarClasesDePago } from "~~/services/content/publico";

type Props = {
  params: Promise<{ slug: string }>;
};

const PaginaCurso = async ({ params }: Props) => {
  const { slug } = await params;
  const curso = await contentRepository.obtenerCursoPorSlug(slug);

  if (!curso) notFound();

  // Solo el módulo gratuito lleva su URL a la página; las de pago las
  // entrega /api/clase tras consultar la membresía en el contrato.
  return <VistaCurso curso={ocultarClasesDePago(curso)} />;
};

export default PaginaCurso;
