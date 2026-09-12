import type { NextPage } from "next";
import { CursoCard } from "~~/components/cursos/CursoCard";
import { contentRepository } from "~~/services/content";

const Home: NextPage = async () => {
  const cursos = await contentRepository.listarCursos();

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Aprende sin fronteras</h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Cursos de creadores bolivianos. Tu acceso te pertenece — y cuando termines, se lo puedes pasar a alguien.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursos.map(curso => (
          <CursoCard key={curso.id} curso={curso} />
        ))}
      </div>
    </div>
  );
};

export default Home;
