import { staticContentRepository } from "./staticRepository";
import { describe, expect, it } from "vitest";

describe("staticContentRepository", () => {
  it("lista todos los cursos", async () => {
    const cursos = await staticContentRepository.listarCursos();
    expect(cursos).toHaveLength(3);
  });

  it("obtiene un curso por su slug", async () => {
    const curso = await staticContentRepository.obtenerCursoPorSlug("ingles-basico");
    expect(curso?.titulo).toBe("Inglés desde cero");
  });

  it("devuelve null si el slug no existe", async () => {
    const curso = await staticContentRepository.obtenerCursoPorSlug("no-existe");
    expect(curso).toBeNull();
  });

  it("cada curso tiene exactamente un módulo gratuito", async () => {
    const cursos = await staticContentRepository.listarCursos();
    for (const curso of cursos) {
      const gratuitos = curso.modulos.filter(m => m.esGratuito);
      expect(gratuitos).toHaveLength(1);
    }
  });

  it("el módulo gratuito es siempre el primero", async () => {
    const cursos = await staticContentRepository.listarCursos();
    for (const curso of cursos) {
      expect(curso.modulos[0].esGratuito).toBe(true);
    }
  });
});
