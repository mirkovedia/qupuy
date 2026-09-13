import { MENSAJES_DEL_LOCK, explicarError, mensajeParaError } from "./erroresDelLock";
import { BaseError } from "viem";
import { describe, expect, it } from "vitest";

describe("mensajeParaError", () => {
  it("traduce los errores conocidos del Lock", () => {
    expect(mensajeParaError("MAX_KEYS_REACHED")).toMatch(/ya tiene un acceso/);
    expect(mensajeParaError("KEY_NOT_VALID")).toMatch(/vencido/);
    expect(mensajeParaError("UNAUTHORIZED")).toMatch(/permiso/);
  });

  it("devuelve undefined para nombres desconocidos o ausentes", () => {
    expect(mensajeParaError("ALGO_RARO")).toBeUndefined();
    expect(mensajeParaError(undefined)).toBeUndefined();
  });

  it("todos los mensajes están en español y terminan en punto", () => {
    for (const mensaje of Object.values(MENSAJES_DEL_LOCK)) expect(mensaje).toMatch(/\.$/);
  });
});

describe("explicarError", () => {
  it("sustituye el 'execution reverted' pelado por una frase legible", () => {
    expect(explicarError(new BaseError("execution reverted"))).toMatch(/rechazó la operación/);
  });

  it("deja pasar otros mensajes tal cual", () => {
    expect(explicarError(new Error("Se cortó la conexión"))).toBe("Se cortó la conexión");
  });
});
