export type Modulo = {
  id: string;
  titulo: string;
  duracionSegundos: number;
  videoUrl: string;
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
  portadaUrl: string;
  /** Precio de referencia mostrado al usuario, en bolivianos */
  precioBs: number;
  duracionDias: number;
  /** Clave que resuelve la dirección del Lock en LOCKS_POR_RED */
  lockKey: string;
  modulos: Modulo[];
};
