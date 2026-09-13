import type { Curso } from "~~/types/curso";

/**
 * Contenido de demostración.
 *
 * Los videos son clips de archivo de Mixkit compartidos entre los tres cursos;
 * las duraciones son las reales de cada archivo, no las de una clase
 * imaginaria. En producción cada módulo apuntaría a su propio video.
 */
export const CURSOS: Curso[] = [
  {
    id: "1",
    slug: "ingles-basico",
    titulo: "Inglés desde cero",
    descripcion:
      "Aprende a presentarte, hacer preguntas y sostener una conversación básica en inglés. Sin gramática aburrida.",
    creador: { nombre: "María Quispe", ciudad: "Cochabamba" },
    precioBs: 70,
    duracionDias: 30,
    lockKey: "ingles-basico",
    modulos: [
      {
        id: "1-1",
        titulo: "Presentarte en inglés",
        duracionSegundos: 8,
        videoUrl: "/videos/ingles-01.mp4",
        esGratuito: true,
      },
      {
        id: "1-2",
        titulo: "El verbo to be",
        duracionSegundos: 11,
        videoUrl: "/videos/ingles-02.mp4",
        esGratuito: false,
      },
      {
        id: "1-3",
        titulo: "Presente simple",
        duracionSegundos: 6,
        videoUrl: "/videos/ingles-03.mp4",
        esGratuito: false,
      },
      {
        id: "1-4",
        titulo: "Vocabulario del día a día",
        duracionSegundos: 11,
        videoUrl: "/videos/ingles-04.mp4",
        esGratuito: false,
      },
    ],
  },
  {
    id: "2",
    slug: "excel-negocios",
    titulo: "Excel para tu negocio",
    descripcion: "Lleva el control de tu tienda o emprendimiento: inventario, ventas y ganancias en planillas simples.",
    creador: { nombre: "Jorge Mamani", ciudad: "La Paz" },
    precioBs: 50,
    duracionDias: 30,
    lockKey: "excel-negocios",
    modulos: [
      {
        id: "2-1",
        titulo: "Tu primera planilla de ventas",
        duracionSegundos: 8,
        videoUrl: "/videos/ingles-01.mp4",
        esGratuito: true,
      },
      {
        id: "2-2",
        titulo: "Fórmulas que sí vas a usar",
        duracionSegundos: 11,
        videoUrl: "/videos/ingles-02.mp4",
        esGratuito: false,
      },
      {
        id: "2-3",
        titulo: "Control de inventario",
        duracionSegundos: 6,
        videoUrl: "/videos/ingles-03.mp4",
        esGratuito: false,
      },
    ],
  },
  {
    id: "3",
    slug: "reparacion-celulares",
    titulo: "Reparación de celulares",
    descripcion: "Cambio de pantalla, batería y diagnóstico de fallas comunes. Empieza a cobrar por arreglar equipos.",
    creador: { nombre: "Luis Choque", ciudad: "Santa Cruz" },
    precioBs: 120,
    duracionDias: 30,
    lockKey: "reparacion-celulares",
    modulos: [
      {
        id: "3-1",
        titulo: "Herramientas que necesitas",
        duracionSegundos: 8,
        videoUrl: "/videos/ingles-01.mp4",
        esGratuito: true,
      },
      {
        id: "3-2",
        titulo: "Cambiar una pantalla",
        duracionSegundos: 11,
        videoUrl: "/videos/ingles-02.mp4",
        esGratuito: false,
      },
      {
        id: "3-3",
        titulo: "Reemplazo de batería",
        duracionSegundos: 11,
        videoUrl: "/videos/ingles-04.mp4",
        esGratuito: false,
      },
    ],
  },
];
