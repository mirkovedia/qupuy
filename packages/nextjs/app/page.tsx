import type { NextPage } from "next";
import { CadenaDemostrativa } from "~~/components/cursos/CadenaDemostrativa";
import { CursoCard } from "~~/components/cursos/CursoCard";
import { contentRepository } from "~~/services/content";

const Home: NextPage = async () => {
  const cursos = await contentRepository.listarCursos();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-6xl">
      <header className="mb-16 sm:mb-24">
        <h1 className="text-5xl sm:text-7xl font-display leading-[0.95] mb-6">
          Aprende.
          <br />
          Termina.
          <br />
          <span className="text-primary">Pásalo.</span>
        </h1>

        <p className="text-lg text-base-content/70 max-w-xl leading-relaxed">
          Cursos de creadores bolivianos. Tu acceso es tuyo — y cuando termines, se lo puedes pasar a alguien, como se
          presta un libro.
        </p>
      </header>

      <div className="mb-16 sm:mb-20">
        <CadenaDemostrativa />
      </div>

      <div className="flex items-baseline justify-between mb-6 pb-3 border-b border-base-content/10">
        <h2 className="text-sm uppercase tracking-[0.18em] text-base-content/50 font-sans font-medium m-0">Catálogo</h2>
        <span className="dato text-base-content/40">
          {cursos.length} curso{cursos.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursos.map(curso => (
          <CursoCard key={curso.id} curso={curso} />
        ))}
      </div>

      <section className="mt-24 sm:mt-32 pt-12 border-t border-base-content/10 grid gap-10 sm:grid-cols-3">
        <div>
          <h3 className="text-base font-display mb-2">Por qué existe</h3>
          <p className="text-sm text-base-content/65 leading-relaxed m-0">
            Bolivia es el único país de Latinoamérica sin PayPal, y MercadoPago no opera aquí. Un creador local no tiene
            forma de cobrar por internet.
          </p>
        </div>
        <div>
          <h3 className="text-base font-display mb-2">Cómo funciona</h3>
          <p className="text-sm text-base-content/65 leading-relaxed m-0">
            Cada curso tiene una membresía en Unlock Protocol. Pagas una vez, te dura 30 días, y el acceso vive en tu
            wallet — no en la cuenta de una plataforma.
          </p>
        </div>
        <div>
          <h3 className="text-base font-display mb-2">Qué lo hace distinto</h3>
          <p className="text-sm text-base-content/65 leading-relaxed m-0">
            Ninguna plataforma te deja prestar un curso. Aquí solo una persona tiene el acceso a la vez: si lo pasas, lo
            pierdes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
