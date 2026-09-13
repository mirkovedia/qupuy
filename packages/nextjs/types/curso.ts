export type Modulo = {
  id: string;
  titulo: string;
  /** Duración real del archivo de video, en segundos. */
  duracionSegundos: number;
  /**
   * URL del video. En la página solo viaja para el módulo gratuito: las de
   * pago las entrega `/api/clase/[id]` después de consultar la membresía en
   * el contrato.
   */
  videoUrl?: string;
  /** El módulo de vista previa, accesible sin membresía */
  esGratuito: boolean;
};

export type Creador = {
  nombre: string;
  ciudad: string;
};

export type Curso = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  creador: Creador;
  /**
   * Precio de referencia en bolivianos: lo que el creador cobraría. El
   * cobro real lo hace el Lock, en la moneda y al precio que tenga configurados.
   */
  precioBs: number;
  /** Duración de referencia; la real se lee del Lock (`expirationDuration`). */
  duracionDias: number;
  /** Clave que resuelve la dirección del Lock en LOCKS_POR_RED */
  lockKey: string;
  modulos: Modulo[];
};
