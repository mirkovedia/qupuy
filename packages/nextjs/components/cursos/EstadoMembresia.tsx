import type { EstadoAcceso } from "~~/utils/membresia";

type Props = {
  estado: EstadoAcceso;
  diasRestantes?: number;
};

export const EstadoMembresia = ({ estado, diasRestantes }: Props) => {
  if (estado === "activo") {
    return (
      <div className="badge badge-success gap-2">
        ✓ Acceso activo
        {diasRestantes !== undefined && <span>· vence en {diasRestantes} días</span>}
      </div>
    );
  }

  if (estado === "vencido") {
    return <div className="badge badge-warning gap-2">Tu acceso venció</div>;
  }

  return <div className="badge badge-ghost gap-2">🔒 Sin acceso</div>;
};
