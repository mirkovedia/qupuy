import type { EstadoAcceso } from "~~/utils/membresia";

type Props = {
  estado: EstadoAcceso;
  diasRestantes?: number;
  /** Versión reducida para las tarjetas del catálogo. */
  compacto?: boolean;
};

export const EstadoMembresia = ({ estado, diasRestantes, compacto = false }: Props) => {
  if (estado === "activo") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 shrink-0 ${
          compacto ? "text-[11px]" : "text-xs"
        } text-accent border border-accent/35 bg-accent/10 px-2 py-1 leading-none`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        {compacto ? "Activo" : "Acceso activo"}
        {diasRestantes !== undefined && !compacto && <span className="dato opacity-70">· {diasRestantes} días</span>}
      </span>
    );
  }

  if (estado === "vencido") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 shrink-0 ${
          compacto ? "text-[11px]" : "text-xs"
        } text-warning border border-warning/35 bg-warning/10 px-2 py-1 leading-none`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-warning" />
        {compacto ? "Vencido" : "Tu acceso venció"}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 shrink-0 ${
        compacto ? "text-[11px]" : "text-xs"
      } text-base-content/40 border border-base-content/15 px-2 py-1 leading-none`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-base-content/25" />
      Sin acceso
    </span>
  );
};
