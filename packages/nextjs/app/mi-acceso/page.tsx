import { ListaAccesos } from "./ListaAccesos";
import type { NextPage } from "next";
import { contentRepository } from "~~/services/content";

const MiAcceso: NextPage = async () => {
  const cursos = await contentRepository.listarCursos();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
      <header className="mb-10 pb-6 border-b border-base-content/10">
        <h1 className="text-4xl sm:text-5xl font-display leading-none m-0">Mis accesos</h1>
        <p className="text-base-content/60 mt-3 mb-0 max-w-lg">
          Tus cursos desbloqueados. Puedes pasarle cualquiera a otra persona.
        </p>
      </header>

      <ListaAccesos cursos={cursos} />
    </div>
  );
};

export default MiAcceso;
