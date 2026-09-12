import { resolverLock } from "./locks";
import { describe, expect, it } from "vitest";

const BASE_SEPOLIA = 84532;

describe("resolverLock", () => {
  it("devuelve la dirección de un Lock registrado", () => {
    const address = resolverLock("ingles-basico", BASE_SEPOLIA);
    expect(address).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("devuelve undefined si el lockKey no existe", () => {
    expect(resolverLock("curso-inventado", BASE_SEPOLIA)).toBeUndefined();
  });

  it("devuelve undefined si la red no está soportada", () => {
    expect(resolverLock("ingles-basico", 999999)).toBeUndefined();
  });
});
