import { NextResponse } from "next/server";
import { isAddress } from "viem";
import { resolverLock } from "~~/contracts/unlock/locks";
import { PUBLIC_LOCK_ABI } from "~~/contracts/unlock/publicLockAbi";
import { contentRepository } from "~~/services/content";
import { RED_DEL_LOCK, clienteServidor } from "~~/services/web3/clienteServidor";

type Params = { params: Promise<{ moduloId: string }> };

const SIN_CACHE = { "Cache-Control": "no-store" };

const error = (mensaje: string, code: string, status: number) =>
  NextResponse.json({ error: mensaje, code }, { status, headers: SIN_CACHE });

/**
 * Entrega la URL de una clase después de consultar la membresía en el Lock.
 *
 * Las clases de pago no viajan en la página: el cliente las pide aquí con su
 * dirección, y el servidor pregunta a `getHasValidKey` antes de responder.
 * Limitación conocida: sin una firma (SIWE), el endpoint confía en la
 * dirección que se le indica. La ruta de producción es autenticar la wallet y
 * devolver URLs firmadas con expiración corta.
 */
export async function GET(request: Request, { params }: Params) {
  const { moduloId } = await params;
  const address = new URL(request.url).searchParams.get("address");

  const cursos = await contentRepository.listarCursos();
  const curso = cursos.find(c => c.modulos.some(m => m.id === moduloId));
  const modulo = curso?.modulos.find(m => m.id === moduloId);
  if (!curso || !modulo || !modulo.videoUrl) return error("La clase no existe", "NOT_FOUND", 404);

  if (modulo.esGratuito) return NextResponse.json({ videoUrl: modulo.videoUrl }, { headers: SIN_CACHE });

  if (!address || !isAddress(address))
    return error("Hace falta una dirección de wallet válida", "VALIDATION_ERROR", 400);

  const lockAddress = resolverLock(curso.lockKey, RED_DEL_LOCK.id);
  if (!lockAddress) return error("Este curso no tiene un Lock configurado", "LOCK_NOT_CONFIGURED", 503);

  try {
    const tieneAcceso = await clienteServidor.readContract({
      address: lockAddress,
      abi: PUBLIC_LOCK_ABI,
      functionName: "getHasValidKey",
      args: [address],
    });

    if (!tieneAcceso) return error("Esa wallet no tiene una membresía válida para este curso", "NO_ACCESS", 403);

    return NextResponse.json({ videoUrl: modulo.videoUrl }, { headers: SIN_CACHE });
  } catch (causa) {
    console.error("No se pudo consultar el Lock", causa);
    return error("No se pudo consultar el contrato. Inténtalo de nuevo.", "RPC_ERROR", 502);
  }
}
