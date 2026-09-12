import type { Curso } from "~~/types/curso";

/**
 * Fuente de contenido del portal. Hoy se sirve desde un archivo estático;
 * migrar a base de datos o CMS significa escribir otra implementación de
 * esta interfaz y cambiarla en services/content/index.ts.
 */
export interface ContentRepository {
  listarCursos(): Promise<Curso[]>;
  obtenerCursoPorSlug(slug: string): Promise<Curso | null>;
}
