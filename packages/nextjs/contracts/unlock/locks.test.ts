import { type RegistroLocks, leerLock, resolverLock } from "./locks";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SEPOLIA = 11155111;
const DIRECCION = "0x761963f20958660130181fa785ddd6efc64fa862";

describe("leerLock", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("acepta una dirección válida", () => {
    expect(leerLock(DIRECCION, "X")).toBe(DIRECCION);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("devuelve undefined y avisa si la variable falta", () => {
    expect(leerLock(undefined, "NEXT_PUBLIC_LOCK_X")).toBeUndefined();
    expect(console.warn).toHaveBeenCalledOnce();
  });

  it("devuelve undefined si el valor no es una dirección", () => {
    expect(leerLock("0x", "X")).toBeUndefined();
    expect(leerLock("hola", "X")).toBeUndefined();
    expect(leerLock("0x1234", "X")).toBeUndefined();
  });
});

describe("resolverLock", () => {
  const registro: RegistroLocks = {
    [SEPOLIA]: { "ingles-basico": DIRECCION, "sin-lock": undefined },
  };

  it("devuelve la dirección de un Lock registrado", () => {
    expect(resolverLock("ingles-basico", SEPOLIA, registro)).toBe(DIRECCION);
  });

  it("devuelve undefined si el lockKey no existe", () => {
    expect(resolverLock("curso-inventado", SEPOLIA, registro)).toBeUndefined();
  });

  it("devuelve undefined si la red no está soportada", () => {
    expect(resolverLock("ingles-basico", 999999, registro)).toBeUndefined();
  });

  it("devuelve undefined si el Lock quedó sin dirección", () => {
    expect(resolverLock("sin-lock", SEPOLIA, registro)).toBeUndefined();
  });
});
