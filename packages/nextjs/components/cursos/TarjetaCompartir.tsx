"use client";

import { useRef, useState } from "react";
import { notification } from "~~/utils/scaffold-eth";

type Props = {
  titulo: string;
  creador: string;
  vecesPasado: number;
  personas: number;
};

const ANCHO = 1200;
const ALTO = 630;

const TIERRA = "#1a1512";
const CHICHA = "#d4463c";
const MAIZ = "#e8b04b";
const CIELO = "#4a9d9c";
const HUESO = "#f2ede4";
const TENUE = "#968c80";

/**
 * Genera una imagen con el linaje del acceso, lista para compartir.
 *
 * El dato que la hace interesante — por cuántas manos ha pasado este curso —
 * solo existe en tiempo de ejecución, así que la imagen se dibuja en el
 * navegador en lugar de servirse pregenerada.
 */
export const TarjetaCompartir = ({ titulo, creador, vecesPasado, personas }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generando, setGenerando] = useState(false);

  const dibujar = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = TIERRA;
    ctx.fillRect(0, 0, ANCHO, ALTO);

    // Banda de aguayo
    let x = 0;
    while (x < ANCHO) {
      ctx.fillStyle = CHICHA;
      ctx.fillRect(x, 0, 46, 7);
      x += 46;
      ctx.fillStyle = MAIZ;
      ctx.fillRect(x, 0, 26, 7);
      x += 26;
      ctx.fillStyle = CIELO;
      ctx.fillRect(x, 0, 20, 7);
      x += 20 + 22;
    }

    // Logo: llave que se convierte en flecha
    const cx = 90;
    const cy = 120;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = CHICHA;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 26, cy);
    ctx.lineTo(cx + 150, cy);
    ctx.moveTo(cx + 62, cy);
    ctx.lineTo(cx + 62, cy + 22);
    ctx.moveTo(cx + 88, cy);
    ctx.lineTo(cx + 88, cy + 22);
    ctx.stroke();
    ctx.strokeStyle = MAIZ;
    ctx.beginPath();
    ctx.moveTo(cx + 150, cy);
    ctx.lineTo(cx + 128, cy - 22);
    ctx.moveTo(cx + 150, cy);
    ctx.lineTo(cx + 128, cy + 22);
    ctx.stroke();

    // El titular
    ctx.fillStyle = HUESO;
    ctx.font = "600 64px Georgia, serif";
    ctx.fillText(titulo, 88, 280);

    ctx.fillStyle = TENUE;
    ctx.font = "26px system-ui, sans-serif";
    ctx.fillText(`Por ${creador}`, 88, 324);

    // El dato que nadie más puede mostrar
    ctx.fillStyle = HUESO;
    ctx.font = "600 46px Georgia, serif";
    if (vecesPasado === 0) {
      ctx.fillText("Un acceso que se puede pasar", 88, 424);
    } else {
      ctx.fillText("Este acceso ya pasó por", 88, 424);
      ctx.fillStyle = CHICHA;
      ctx.font = "600 62px Georgia, serif";
      ctx.fillText(vecesPasado === 1 ? "una mano" : `${vecesPasado} manos`, 88, 492);
    }

    // Cadena de nudos a la derecha
    const nudos = Math.min(personas || 1, 4);
    const bx = 1020;
    const by = 260;
    for (let i = 0; i < nudos; i++) {
      const y = by + i * 72;
      if (i < nudos - 1) {
        ctx.strokeStyle = "#463a2e";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx, y + 12);
        ctx.lineTo(bx, y + 60);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(bx, y, i === 0 ? 10 : 12, 0, Math.PI * 2);
      if (i === 0) {
        ctx.strokeStyle = "#5a4c3e";
        ctx.lineWidth = 4;
        ctx.stroke();
      } else {
        ctx.fillStyle = i === nudos - 1 ? CHICHA : MAIZ;
        ctx.fill();
      }
    }

    ctx.fillStyle = TENUE;
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText("qupuy.vercel.app  ·  v. dar a otro; pagar", 88, 566);
  };

  const descargar = () => {
    setGenerando(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      dibujar(ctx);

      canvas.toBlob(blob => {
        if (!blob) {
          notification.error("No se pudo generar la imagen");
          return;
        }
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = `qupuy-${titulo.toLowerCase().replace(/\s+/g, "-")}.png`;
        enlace.click();
        URL.revokeObjectURL(url);
        notification.success("Imagen descargada");
      }, "image/png");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width={ANCHO} height={ALTO} className="hidden" aria-hidden />
      <button type="button" className="btn btn-ghost btn-sm w-full" disabled={generando} onClick={descargar}>
        Descargar imagen para compartir
      </button>
    </>
  );
};
