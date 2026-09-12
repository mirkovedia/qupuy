import { notFound } from "next/navigation";
import { VistaCurso } from "./VistaCurso";
import { contentRepository } from "~~/services/content";

type Props = {
  params: Promise<{ slug: string }>;
};

const PaginaCurso = async ({ params }: Props) => {
  const { slug } = await params;
  const curso = await contentRepository.obtenerCursoPorSlug(slug);

  if (!curso) notFound();

  return <VistaCurso curso={curso} />;
};

export default PaginaCurso;
