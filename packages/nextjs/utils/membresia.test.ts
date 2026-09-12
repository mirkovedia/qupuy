import { calcularDiasRestantes, determinarEstado } from "./membresia";
import { describe, expect, it } from "vitest";

const ahora = new Date("2026-09-11T12:00:00Z");
const enSegundos = (fecha: Date) => BigInt(Math.floor(fecha.getTime() / 1000));

describe("calcularDiasRestantes", () => {
  it("calcula los días completos que faltan", () => {
    const dentroDe10Dias = new Date("2026-09-21T12:00:00Z");
    expect(calcularDiasRestantes(enSegundos(dentroDe10Dias), ahora)).toBe(10);
  });

  it("devuelve 0 si ya expiró", () => {
    const hace3Dias = new Date("2026-09-08T12:00:00Z");
    expect(calcularDiasRestantes(enSegundos(hace3Dias), ahora)).toBe(0);
  });

  it("devuelve 0 si expira exactamente ahora", () => {
    expect(calcularDiasRestantes(enSegundos(ahora), ahora)).toBe(0);
  });

  it("redondea hacia abajo las fracciones de día", () => {
    const dentroDe36Horas = new Date("2026-09-13T00:00:00Z");
    expect(calcularDiasRestantes(enSegundos(dentroDe36Horas), ahora)).toBe(1);
  });
});

describe("determinarEstado", () => {
  it("es 'activo' cuando el contrato reporta key válida", () => {
    expect(determinarEstado(true, 28)).toBe("activo");
  });

  it("es 'vencido' cuando tuvo key pero ya no es válida", () => {
    expect(determinarEstado(false, 0)).toBe("vencido");
  });

  it("es 'sin-acceso' cuando nunca tuvo key", () => {
    expect(determinarEstado(false, undefined)).toBe("sin-acceso");
  });
});
