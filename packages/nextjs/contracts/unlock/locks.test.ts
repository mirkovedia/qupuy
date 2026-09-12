import { resolverLock } from "./locks";
import { describe, expect, it } from "vitest";

const SEPOLIA = 11155111;

describe("resolverLock", () => {
  it("devuelve la dirección de un Lock registrado", () => {
    const address = resolverLock("ingles-basico", SEPOLIA);
    expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("devuelve undefined si el lockKey no existe", () => {
    expect(resolverLock("curso-inventado", SEPOLIA)).toBeUndefined();
  });

  it("devuelve undefined si la red no está soportada", () => {
    expect(resolverLock("ingles-basico", 999999)).toBeUndefined();
  });
});
