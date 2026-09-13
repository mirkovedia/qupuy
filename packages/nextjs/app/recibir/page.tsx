import { PantallaRecibir } from "./PantallaRecibir";
import type { NextPage } from "next";
import { contentRepository } from "~~/services/content";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Recibir un acceso",
  description: "Muestra tu código y recibe el acceso a un curso de otra persona.",
});

const Recibir: NextPage = async () => {
  const cursos = await contentRepository.listarCursos();
  return <PantallaRecibir cursos={cursos} />;
};

export default Recibir;
