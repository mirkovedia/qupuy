import { partirEnTramos } from "./clienteEventos";
import { describe, expect, it } from "vitest";

describe("partirEnTramos", () => {
  it("devuelve un solo tramo cuando el rango cabe", () => {
    expect(partirEnTramos(100n, 150n, 1_000n)).toEqual([{ desde: 100n, hasta: 150n }]);
  });

  it("parte en tramos consecutivos sin huecos ni solapes", () => {
    const tramos = partirEnTramos(0n, 25n, 10n);
    expect(tramos).toEqual([
      { desde: 0n, hasta: 9n },
      { desde: 10n, hasta: 19n },
      { desde: 20n, hasta: 25n },
    ]);
  });

  it("un rango de un solo bloque es un tramo de un bloque", () => {
    expect(partirEnTramos(7n, 7n, 10n)).toEqual([{ desde: 7n, hasta: 7n }]);
  });

  it("devuelve vacío si el rango está invertido o el tamaño no es válido", () => {
    expect(partirEnTramos(10n, 5n, 10n)).toEqual([]);
    expect(partirEnTramos(0n, 5n, 0n)).toEqual([]);
  });

  it("cubre exactamente el rango cuando el tamaño divide al total", () => {
    expect(partirEnTramos(0n, 19n, 10n)).toEqual([
      { desde: 0n, hasta: 9n },
      { desde: 10n, hasta: 19n },
    ]);
  });
});
