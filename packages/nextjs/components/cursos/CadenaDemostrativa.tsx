"use client";

/**
 * La idea del producto, contada como una cadena.
 *
 * En la portada el visitante todavía no tiene ningún acceso, así que no hay
 * linaje real que mostrar. Esta pieza explica el concepto con la misma forma
 * visual que tendrá después con datos de la blockchain: nudos unidos por un
 * hilo, como un quipu.
 */
const PASOS = [
  { quien: "María", que: "Compra el curso", detalle: "Bs 70 · 30 días", tipo: "compra" as const },
  { quien: "Su hermana", que: "Recibe el acceso", detalle: "María ya terminó", tipo: "pase" as const },
  { quien: "Un vecino", que: "Recibe el acceso", detalle: "Y sigue circulando", tipo: "pase" as const },
];

export const CadenaDemostrativa = () => (
  <div className="border border-base-content/10 bg-base-100 overflow-hidden">
    <div className="aguayo" />

    <div className="p-6 sm:p-8">
      <h2 className="text-xs uppercase tracking-[0.14em] text-base-content/50 m-0 mb-6">Un acceso, varias manos</h2>

      <ol className="relative m-0 p-0 list-none sm:flex sm:gap-0">
        {PASOS.map((paso, i) => {
          const ultimo = i === PASOS.length - 1;
          return (
            <li key={paso.quien} className="relative pl-7 pb-6 last:pb-0 sm:pl-0 sm:pb-0 sm:pt-7 sm:flex-1">
              {/* El hilo que une los nudos */}
              {!ultimo && (
                <span className="absolute left-[5px] top-4 bottom-0 w-px bg-base-content/15 sm:left-3 sm:top-[5px] sm:bottom-auto sm:h-px sm:w-full" />
              )}

              <span
                className={`absolute left-0 top-2 w-[11px] h-[11px] rounded-full border-2 sm:top-0 sm:left-0 ${
                  paso.tipo === "compra" ? "bg-base-100 border-base-content/30" : "bg-accent border-accent"
                }`}
              />

              <div className="sm:pr-6">
                <p className="font-display text-lg leading-tight m-0">{paso.quien}</p>
                <p className="text-sm text-base-content/65 m-0 mt-1">{paso.que}</p>
                <p className="dato text-[11px] text-base-content/35 m-0 mt-1.5">{paso.detalle}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-base-content/60 leading-relaxed mt-7 pt-5 border-t border-base-content/10 mb-0">
        Cada paso queda registrado en la blockchain. Ninguna plataforma de cursos puede decirte a quién le prestaste tu
        acceso — aquí la cadena completa es pública y verificable.
      </p>
    </div>
  </div>
);
