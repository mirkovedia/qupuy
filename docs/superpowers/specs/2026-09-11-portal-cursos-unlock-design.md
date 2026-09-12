# Qupuy — Portal de cursos con acceso transferible

**Fecha:** 2026-09-11
**Track:** Unlock Protocol — Bounty 2 (Best Build: Portal de Contenido Token-Gated)
**Evento:** ETH Bolivia Buildathon 2026 · Cochabamba
**Estado:** Aprobado — listo para plan de implementación

> **Qupuy** (quechua): *dar a otro, entregar* — y también *pagar*.
> Una sola palabra para las dos acciones centrales del producto.

---

## 1. Resumen

Portal de cursos donde el acceso a cada curso es una membresía de Unlock
(un NFT ERC-721 con expiración). El visitante descubre cursos, previsualiza
contenido gratuito, y desbloquea el curso completo comprando una Key.

**El diferenciador:** el acceso es transferible. Al terminar un curso, el
usuario puede pasarle su acceso a otra persona — como se presta un libro.
Solo una persona lo tiene a la vez.

### Por qué este enfoque

Las plataformas existentes (Udemy, Hotmart, Teachable) son inaccesibles para
creadores bolivianos: Bolivia es el único país de Latinoamérica sin PayPal, y
MercadoPago no opera en el país. Un creador local no tiene forma de cobrar por
internet.

Unlock resuelve el cobro, y añade una propiedad que ninguna plataforma web2
puede ofrecer: un acceso que el usuario **posee** y puede transferir.

---

## 2. Alcance

### P0 — Flujo obligatorio del bounty (nunca se corta)

El bounty exige este flujo, y es la base del proyecto:

```
Descubrir → Previsualizar → Verificar membresía → Desbloquear → Contenido completo
```

| # | Requisito del bounty | Implementación |
| - | -------------------- | -------------- |
| 1 | Creadores publican contenido restringido | Catálogo de cursos, cada uno atado a un Lock |
| 2 | Visitantes previsualizan una parte | Video: primer módulo libre |
| 3 | Verificar si posee la membresía Unlock | `getHasValidKey(address)` |
| 4 | Otorgar acceso con membresía válida | Render condicional del contenido completo |
| 5 | Camino claro para comprar la membresía | `purchase()` vía wagmi |

### P1 — Diferenciador (solo si P0 está cerrado)

- Transferencia de acceso entre wallets (`transferFrom`)
- Pantalla `/mi-acceso` con Keys activas y vencidas

### P2 — Se corta primero

- Checkout de Unlock (`@unlock-protocol/paywall`) como alternativa de compra
- Múltiples niveles de membresía

### Fuera de alcance

- Contratos Solidity propios (Unlock ya provee el PublicLock)
- Panel de administración para creadores
- Base de datos (la capa está aislada para migrar después)
- Subida de archivos
- Tests automatizados de UI

---

## 3. Arquitectura

### 3.1 Vista general

```
┌─────────────────────────────────────────────────────┐
│  Capa de presentación (App Router)                  │
│  app/page.tsx · app/curso/[id] · app/mi-acceso      │
├─────────────────────────────────────────────────────┤
│  Componentes de dominio                             │
│  components/cursos/*                                │
├─────────────────────────────────────────────────────┤
│  Capa de acceso (única que conoce Unlock)           │
│  hooks/useMembresia · hooks/useTransferirAcceso     │
├─────────────────────────────────────────────────────┤
│  Capa de datos (abstraída)      │  Capa onchain     │
│  services/content/*             │  contracts/unlock │
│  ContentRepository (interfaz)   │  Lock ABI + config│
└─────────────────────────────────────────────────────┘
                                            ↓
                          Lock de Unlock (Base Sepolia)
```

**Regla de fronteras:** ningún componente de presentación llama a un contrato
directamente. Todo pasa por la capa de acceso. Eso permite cambiar la fuente de
verdad (contrato → indexador → API) sin tocar la UI.

### 3.2 Decisión: cero Solidity propio

No escribimos ni desplegamos contratos. El PublicLock de Unlock es un ERC-721
completo que expone todo lo necesario:

| Función | Uso |
| ------- | --- |
| `getHasValidKey(address) → bool` | Verificación de acceso |
| `purchase(...)` | Compra de membresía |
| `transferFrom(from, to, tokenId)` | Transferencia (P1) |
| `keyExpirationTimestampFor(tokenId) → uint` | Días restantes |
| `tokenOfOwnerByIndex(address, index) → uint` | Obtener el tokenId del usuario |

**Justificación:** el bounty evalúa *integración con Unlock* (30%), no volumen
de Solidity. Un contrato propio añadiría superficie de bugs, tests, deploy y
verificación sin sumar puntos en ninguna categoría de la rúbrica. El tiempo
liberado va al frontend, donde están UX (25%) y creatividad (25%).

### 3.3 Capa de datos abstraída

El contenido hoy vive en un archivo tipado, pero detrás de una interfaz:

```typescript
// services/content/types.ts
export interface ContentRepository {
  listarCursos(): Promise<Curso[]>;
  obtenerCurso(id: string): Promise<Curso | null>;
}

// services/content/staticRepository.ts
export const staticContentRepository: ContentRepository = { ... };

// services/content/index.ts — punto único de intercambio
export const contentRepository: ContentRepository = staticContentRepository;
```

Migrar a Postgres, Supabase o un CMS es reemplazar la implementación en
`index.ts`. Las páginas y componentes no cambian.

### 3.4 Registro de Locks

Las direcciones de los Locks no se queman en el código:

```typescript
// contracts/unlock/locks.ts
export const LOCKS_POR_RED: Record<number, Record<string, Address>> = {
  [baseSepolia.id]: {
    "ingles-basico": process.env.NEXT_PUBLIC_LOCK_INGLES as Address,
    // ...
  },
};
```

Desplegar en otra red (p. ej. Avalanche C-Chain) es añadir una entrada, no
reescribir.

Los Locks se registran **además** en `externalContracts.ts`, de modo que la
página `/debug` de SE-2 pueda inspeccionarlos en vivo — una red de seguridad
útil durante la demo.

---

## 4. Modelo de datos

```typescript
// types/curso.ts
export type Modulo = {
  id: string;
  titulo: string;
  duracionSegundos: number;
  videoUrl: string;
  esGratuito: boolean;   // el módulo de preview
};

export type Curso = {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  creador: { nombre: string; ciudad: string };
  portadaUrl: string;
  precioBs: number;          // referencia para el usuario
  duracionDias: number;
  lockKey: string;           // ← puente con LOCKS_POR_RED
  modulos: Modulo[];
};
```

El campo `lockKey` conecta el contenido con su Lock onchain. Es el único
acoplamiento entre las dos capas, y es explícito.

---

## 5. Pantallas

### 5.1 Catálogo (`/`)

Rejilla de tarjetas. Cada tarjeta muestra título, creador, precio, duración y
**si el usuario ya tiene acceso** — el estado se ve antes de entrar.

### 5.2 Curso (`/curso/[slug]`)

La misma ruta, dos estados según la Key del visitante.

**Estado A — sin Key (preview):**
- Reproductor con el módulo gratuito
- Lista completa de módulos, los bloqueados con candado
- Botón "Desbloquear curso completo · Bs X · 30 días"
- Nota: "Tu acceso es tuyo: al terminar, se lo puedes pasar a alguien"

**Estado B — con Key válida:**
- Reproductor con cualquier módulo
- Todos los módulos accesibles
- Indicador "Acceso activo · vence en N días"
- Botón "Pasar mi acceso a alguien" (P1)

> **Decisión de UX:** el estado bloqueado muestra la estructura completa del
> curso con candados, en lugar de esconder todo. El bounty exige que el
> visitante *"pueda experimentar tanto el estado de previsualización como el
> contenido restringido"* — mostrar qué hay detrás del candado cumple eso mejor
> que un muro opaco.

### 5.3 Mi acceso (`/mi-acceso`) — P1

Lista de Keys del usuario, activas y vencidas. Mostrar una vencida es
intencional: demuestra que la expiración es real y que `getHasValidKey` la
respeta.

### 5.4 Modal de transferencia — P1

Usa `AddressInput` de SE-2 (resuelve ENS y valida). Advertencia explícita:
"Tú perderás el acceso. Solo una persona puede tenerlo."

---

## 6. Verificación de acceso — el punto crítico

```typescript
// Dentro de useMembresia — el resto de la app no ve esto
const lockAddress = resolverLock(lockKey, chainId);

const { data: tieneAcceso } = useReadContract({
  address: lockAddress,
  abi: PUBLIC_LOCK_ABI,
  functionName: "getHasValidKey",
  args: [connectedAddress],
});
```

> **Nota sobre el acceso al contrato:** los Locks se resuelven dinámicamente
> desde `LOCKS_POR_RED` (§3.4), por lo que usamos `useReadContract` de wagmi en
> lugar de `useScaffoldReadContract`, que exige un `contractName` estático.
> Ambos son válidos en SE-2; el primero permite N cursos sin declarar N
> contratos. Los Locks también se registran en `externalContracts.ts` para que
> la página `/debug` pueda inspeccionarlos durante la demo.

> ⚠️ **`getHasValidKey`, nunca `balanceOf`.**
> `balanceOf` devuelve 1 aunque la Key esté vencida — el NFT sigue en la wallet.
> `getHasValidKey` comprueba la expiración dentro del contrato.
> Usar `balanceOf` rompería el criterio *"la propiedad o validez de la membresía
> determina el acceso"*. Es el error que descalifica.

Toda la lógica se encapsula en un hook:

```typescript
// hooks/useMembresia.ts
export const useMembresia = (lockKey: string) => {
  // → { tieneAcceso, diasRestantes, tokenId, isLoading, error }
};
```

Ningún componente lee el contrato directamente.

---

## 7. Gating real, no cosmético

```typescript
// ❌ MAL — el contenido está en el DOM, oculto por CSS
<div className={tieneAcceso ? "block" : "hidden"}>
  <video src={videoCompleto} />
</div>

// ✅ BIEN — sin acceso, el contenido nunca se renderiza
{tieneAcceso ? <VideoCompleto src={modulo.videoUrl} /> : <PreviewBloqueado />}
```

El bounty descalifica *"un proyecto donde Unlock sea mencionado, pero no
determine realmente el acceso"*.

**Limitación conocida (documentar en el README):** con archivos estáticos, las
URLs de video son descubribles vía DevTools. Para una demo de hackathon es
aceptable y estándar. La ruta de producción son URLs firmadas con expiración
corta, emitidas por un endpoint que valida la Key server-side. No se implementa
en este alcance, pero queda documentada.

---

## 8. Manejo de errores

Usa las utilidades que SE-2 ya provee:

```typescript
import { notification, getParsedError } from "~~/utils/scaffold-eth";
```

| Situación | Mensaje al usuario |
| --------- | ------------------ |
| Usuario cancela la firma | "Cancelaste la compra" |
| Fondos insuficientes | "No tienes suficiente ETH para esta compra" |
| Red equivocada | "Cambia a Base Sepolia" + botón de cambio |
| Ya tiene Key válida | "Ya tienes acceso a este curso" |
| Transferencia a dirección inválida | "Esa dirección no es válida" |
| Error de RPC | Mensaje de `getParsedError` |

---

## 9. Estructura de archivos

```
packages/nextjs/
├── app/
│   ├── page.tsx                          ← reescribir: catálogo
│   ├── curso/[slug]/page.tsx             ← nuevo
│   └── mi-acceso/page.tsx                ← nuevo (P1)
├── components/cursos/
│   ├── CursoCard.tsx
│   ├── ReproductorVideo.tsx
│   ├── ListaModulos.tsx
│   ├── BotonDesbloquear.tsx
│   ├── EstadoMembresia.tsx
│   └── ModalTransferir.tsx               ← P1
├── hooks/
│   ├── useMembresia.ts                   ← nuevo
│   └── useTransferirAcceso.ts            ← nuevo (P1)
├── services/content/
│   ├── types.ts                          ← interfaz ContentRepository
│   ├── staticRepository.ts               ← implementación actual
│   └── index.ts                          ← punto de intercambio
├── contracts/
│   ├── unlock/publicLockAbi.ts           ← ABI mínimo tipado
│   ├── unlock/locks.ts                   ← registro por red
│   └── externalContracts.ts              ← editar
├── data/cursos.ts                        ← contenido
└── types/curso.ts                        ← tipos de dominio
```

**No se toca:** `hooks/scaffold-eth/`, `components/scaffold-eth/`,
`contracts/deployedContracts.ts`.

---

## 10. Convenciones

Heredadas de `AGENTS.md`, con énfasis en:

- **TypeScript estricto.** Sin `any`. Tipos del ABI derivados por viem.
- **`type` sobre `interface`**, salvo para contratos extensibles
  (`ContentRepository` es `interface` a propósito).
- **Hooks de SE-2** para todo contacto con contratos.
- **`@scaffold-ui/components`** para componentes web3.
- **DaisyUI** con colores semánticos (`bg-base-100`, `text-base-content`).
- **Server Components por defecto**; `"use client"` solo donde hay wallet o estado.
- **Español boliviano** en la UI ("Bs", "pasar tu acceso"). Identificadores en inglés.

---

## 11. Red y despliegue

**Desarrollo y demo:** Base Sepolia (chainId 84532).
Unlock: `0x259813B665C8f6074391028ef782e27B65840d89`

Testnet gratuita, Keys ilimitadas para probar, y Unlock la soporta oficialmente.

**Opción posterior:** Avalanche C-Chain (chainId 43114,
Unlock `0x70cBE5F72dD85aA634d07d2227a421144Af734b3`) para sumar el bounty de
Avalanche. Es cambiar configuración, no código. **No condiciona este diseño.**

> Unlock no soporta Fuji. Sus únicas testnets son Sepolia y Base Sepolia.

**Frontend:** Vercel (requisito del bounty: URL pública probable).

---

## 12. Verificación

Sin tests automatizados de UI — no aportan a la rúbrica en el tiempo
disponible. Lista de verificación manual, documentada y ejecutada antes de la
entrega:

| # | Escenario | Resultado esperado |
| - | --------- | ------------------ |
| 1 | Visitante sin wallet | Ve preview, no ve contenido completo |
| 2 | Wallet conectada sin Key | Ve preview + botón de compra |
| 3 | Compra exitosa | Contenido aparece sin recargar la página |
| 4 | Wallet con Key válida | Acceso completo + días restantes |
| 5 | Key vencida | Vuelve a estado bloqueado |
| 6 | Transferencia (P1) | Origen pierde acceso, destino lo gana |
| 7 | Red equivocada | Aviso claro + botón de cambio |
| 8 | Usuario cancela la firma | Mensaje, sin estado roto |

Escenarios 1-5 cubren los requisitos obligatorios del bounty.

---

## 13. Entregables del bounty

| Entregable | Estado |
| ---------- | ------ |
| Nombre del proyecto | **Qupuy** |
| Repositorio público | Este repo |
| README con la integración de Unlock | A escribir |
| URL pública probable | Vercel |
| Video demo ≤ 3 min | A grabar |
| Dirección del Lock desplegado | Tras desplegar |
| Declaración de código preexistente | `CONTEXT.md` §10 |

---

## 14. Riesgos

| Riesgo | Mitigación |
| ------ | ---------- |
| El Lock no se despliega o falla | Desplegarlo en fase 0, antes de escribir UI |
| RPC de Base Sepolia lento | `pollingInterval` ajustado; Alchemy key propia |
| Transferencia (P1) consume demasiado tiempo | Es P1 — se corta sin afectar el flujo obligatorio |
| Videos pesados en la demo | Clips cortos, alojados estáticamente |
| Confundir `balanceOf` con `getHasValidKey` | Documentado en §6; revisión obligatoria |

---

## 15. Referencias

- [PublicLock API](https://docs.unlock-protocol.com/core-protocol/smart-contracts-api/publiclock/)
- [Template oficial Next.js](https://github.com/unlock-protocol/unlock-with-next) — referencia de patrones; usa Pages Router, **no copiar**
- [Ejemplos de Unlock](https://github.com/unlock-protocol/examples)
- Investigación de redes y direcciones: `CONTEXT.md` §11
