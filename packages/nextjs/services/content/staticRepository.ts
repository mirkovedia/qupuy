import type { ContentRepository } from "./types";
import { CURSOS } from "~~/data/cursos";

export const staticContentRepository: ContentRepository = {
  async listarCursos() {
    return CURSOS;
  },

  async obtenerCursoPorSlug(slug: string) {
    return CURSOS.find(curso => curso.slug === slug) ?? null;
  },
};
