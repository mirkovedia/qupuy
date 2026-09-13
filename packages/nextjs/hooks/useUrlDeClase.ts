"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import type { Modulo } from "~~/types/curso";

type RespuestaClase = { videoUrl: string } | { error: string; code: string };

/**
 * URL del video de una clase.
 *
 * La gratuita viene en la página. Las de pago se piden al servidor, que
 * consulta la membresía en el Lock antes de entregarlas: así las URLs de pago
 * no viajan a ningún navegador sin acceso.
 */
export const useUrlDeClase = (modulo: Modulo, tieneAcceso: boolean) => {
  const { address } = useAccount();
  const necesitaServidor = !modulo.esGratuito;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["clase", modulo.id, address],
    enabled: necesitaServidor && tieneAcceso && Boolean(address),
    retry: 1,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<string> => {
      const respuesta = await fetch(`/api/clase/${encodeURIComponent(modulo.id)}?address=${address}`);
      const cuerpo = (await respuesta.json().catch(() => null)) as RespuestaClase | null;
      if (!respuesta.ok || !cuerpo || !("videoUrl" in cuerpo)) {
        throw new Error(cuerpo && "error" in cuerpo ? cuerpo.error : "No se pudo obtener la clase");
      }
      return cuerpo.videoUrl;
    },
  });

  if (!necesitaServidor) {
    return { src: modulo.videoUrl, isLoading: false, hayError: false, reintentar: () => undefined };
  }

  return {
    src: data,
    isLoading,
    hayError: isError,
    reintentar: () => {
      void refetch();
    },
  };
};
