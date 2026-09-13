import type { Curso } from "~~/types/curso";

/**
 * Versión de un curso apta para enviar al navegador.
 *
 * Todo lo que un Server Component pasa a uno de cliente viaja en la página,
 * tenga o no membresía quien la pide. Por eso las URLs de las clases de pago
 * se quitan aquí: el cliente las pide a `/api/clase/[id]`, que consulta la
 * membresía en el contrato antes de entregarlas.
 */
export const ocultarClasesDePago = (curso: Curso): Curso => ({
  ...curso,
  modulos: curso.modulos.map(modulo => (modulo.esGratuito ? modulo : { ...modulo, videoUrl: undefined })),
});
