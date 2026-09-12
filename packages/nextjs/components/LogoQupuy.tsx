type Props = {
  className?: string;
  /** Atenúa el color cuando el acceso no está activo. */
  apagado?: boolean;
};

/**
 * Marca de Qupuy: una llave cuyos dientes se convierten en flecha.
 *
 * La forma dice las dos cosas del producto a la vez — es una llave (el acceso)
 * y apunta hacia fuera (se pasa a otra persona). El rojo es lo que posees; el
 * amarillo, la dirección en que se mueve.
 */
export const LogoQupuy = ({ className = "h-7 w-auto", apagado = false }: Props) => (
  <svg viewBox="0 0 150 90" fill="none" className={className} role="img" aria-label="Qupuy">
    <circle cx="28" cy="45" r="17" stroke={apagado ? "currentColor" : "var(--color-chicha)"} strokeWidth="6" />
    <circle cx="28" cy="45" r="5" className="fill-base-100" />
    <path
      d="M45 45 H108"
      stroke={apagado ? "currentColor" : "var(--color-chicha)"}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M62 45 V59"
      stroke={apagado ? "currentColor" : "var(--color-chicha)"}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M79 45 V59"
      stroke={apagado ? "currentColor" : "var(--color-chicha)"}
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M108 45 L95 32 M108 45 L95 58"
      stroke={apagado ? "currentColor" : "var(--color-maiz)"}
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
