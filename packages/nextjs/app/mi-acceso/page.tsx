import { ListaAccesos } from "./ListaAccesos";
import type { NextPage } from "next";
import { contentRepository } from "~~/services/content";

const MiAcceso: NextPage = async () => {
  const cursos = await contentRepository.listarCursos();

  return (
    <div className="container mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Mis accesos</h1>
        <p className="text-base-content/70 mt-1">Tus cursos desbloqueados. Puedes pasarle cualquiera a otra persona.</p>
      </header>

      <ListaAccesos cursos={cursos} />
    </div>
  );
};

export default MiAcceso;
