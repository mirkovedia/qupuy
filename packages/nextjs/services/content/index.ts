import { staticContentRepository } from "./staticRepository";
import type { ContentRepository } from "./types";

/**
 * Punto único de intercambio de la fuente de contenido.
 * Para migrar a base de datos, reemplazar esta asignación.
 */
export const contentRepository: ContentRepository = staticContentRepository;

export type { ContentRepository };
