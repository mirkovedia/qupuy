import { type RegistroTransfer, registrosAPasos } from "./linaje";
import { describe, expect, it } from "vitest";

const CERO = "0x0000000000000000000000000000000000000000" as const;
const A = "0x567FCdC8e7148a60b91F3367D09EB1b23aF413aC" as const;
const B = "0xa6fc1c38ebEbda6507272eaaD42033A1e0102e39" as const;

const registro = (from: `0x${string}`, to: `0x${string}`, bloque: bigint): RegistroTransfer => ({
  args: { from, to, tokenId: 1n },
  blockNumber: bloque,
  transactionHash: `0x${bloque.toString(16).padStart(64, "0")}`,
});

describe("registrosAPasos", () => {
  it("marca como compra el evento que sale de la dirección cero", () => {
    const [paso] = registrosAPasos([registro(CERO, A, 100n)]);
    expect(paso.esCompra).toBe(true);
    expect(paso.de).toBeUndefined();
    expect(paso.hacia).toBe(A);
  });

  it("una transferencia entre personas es una mano, no una compra", () => {
    const pasos = registrosAPasos([registro(CERO, A, 100n), registro(A, B, 200n)]);
    expect(pasos).toHaveLength(2);
    expect(pasos[1]).toMatchObject({ de: A, hacia: B, esCompra: false, bloque: 200n });
  });

  it("una quema no aparece en la historia", () => {
    const pasos = registrosAPasos([registro(CERO, A, 100n), registro(A, B, 200n), registro(B, CERO, 300n)]);
    expect(pasos).toHaveLength(2);
    expect(pasos.some(p => p.hacia === CERO)).toBe(false);
  });

  it("tolera eventos sin bloque ni hash", () => {
    const [paso] = registrosAPasos([{ args: { from: CERO, to: A }, blockNumber: null, transactionHash: null }]);
    expect(paso.bloque).toBe(0n);
    expect(paso.hash).toBe("0x");
  });
});
