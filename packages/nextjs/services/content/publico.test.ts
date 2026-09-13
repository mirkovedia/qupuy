import { ocultarClasesDePago } from "./publico";
import { describe, expect, it } from "vitest";
import { CURSOS } from "~~/data/cursos";

describe("ocultarClasesDePago", () => {
  it("quita la URL de las clases de pago y conserva la gratuita", () => {
    for (const curso of CURSOS) {
      const publico = ocultarClasesDePago(curso);
      for (const modulo of publico.modulos) {
        if (modulo.esGratuito) expect(modulo.videoUrl).toBeDefined();
        else expect(modulo.videoUrl).toBeUndefined();
      }
    }
  });

  it("no modifica el curso original", () => {
    const curso = CURSOS[0];
    const urlsAntes = curso.modulos.map(m => m.videoUrl);
    ocultarClasesDePago(curso);
    expect(curso.modulos.map(m => m.videoUrl)).toEqual(urlsAntes);
  });

  it("conserva todo lo demás del curso y de sus módulos", () => {
    const curso = CURSOS[0];
    const publico = ocultarClasesDePago(curso);
    expect(publico.titulo).toBe(curso.titulo);
    expect(publico.modulos.map(m => m.id)).toEqual(curso.modulos.map(m => m.id));
    expect(publico.modulos.map(m => m.titulo)).toEqual(curso.modulos.map(m => m.titulo));
  });
});
