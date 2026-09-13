# Qupuy

**Cursos con acceso transferible, sobre Unlock Protocol.**

> **Qupuy** (quechua): *dar a otro, entregar* — y también *pagar*.
> Una sola palabra para las dos acciones centrales del producto.

Portal de cursos donde el acceso es una membresía de Unlock que el alumno
**posee** y puede pasarle a otra persona. Como se presta un libro.

**ETH Bolivia Buildathon 2026 · Cochabamba** — Track de Unlock Protocol,
Bounty 2: Portal de Contenido Token-Gated.

**▶ Pruébalo: [qupuy.vercel.app](https://qupuy.vercel.app)**
(necesitas una wallet con ETH de Sepolia — [faucet](https://sepolia-faucet.pk910.de/))

---

## El problema

En Bolivia, un creador no tiene forma de cobrar por internet.

No es una exageración. Es un hecho verificable: **Bolivia es el único país de
Latinoamérica sin PayPal**, y MercadoPago opera en toda la región salvo Ecuador,
Bolivia y Venezuela.

Un profesor de inglés en Cochabamba que graba su curso se topa con esto:

| Plataforma | Por qué no puede usarla |
| ---------- | ----------------------- |
| Udemy | Paga por PayPal — no existe en el país |
| Hotmart | Exige cuenta bancaria que reciba dólares |
| Teachable | Usa Stripe — no opera en Bolivia |

Su única salida real es vender por WhatsApp, cobrar por QR y enviar un enlace de
Drive. Tres días después ese enlace circula en cinco grupos: vendió veinte
accesos y lo ven doscientas personas.

**El problema no es que falte blockchain. Es que no tiene forma de cobrar por un
acceso, y de que ese acceso signifique algo.**

---

## La solución

Unlock Protocol resuelve el cobro. Y sus membresías tienen una propiedad que
ninguna plataforma web2 puede ofrecer: **son objetos que el usuario posee**.

Qupuy construye sobre esa propiedad.

### El flujo

```
Descubrir → Previsualizar → Verificar membresía → Desbloquear → Contenido completo
```

El visitante recorre el catálogo, ve el primer módulo de cualquier curso gratis,
y el resto con candado. Al comprar la membresía, el contenido completo aparece
sin recargar la página.

### El diferenciador: el curso que se presta

Toda plataforma de cursos pelea contra que la gente comparta accesos. Qupuy lo
convierte en una característica.

Como la membresía es un NFT ERC-721, **solo una persona la tiene a la vez**. Al
terminar un curso, el alumno puede pasárselo a alguien:

- Alguien termina el curso de inglés y se lo pasa a su hermana.
- Un instituto compra diez accesos y los rota entre generaciones de alumnos.
- Alguien compró un curso y nunca lo usó: lo pasa en vez de perderlo.

En Bolivia los libros de texto se heredan entre hermanos. Esto es lo mismo,
digital — y es imposible de hacer en Udemy, donde "prestar" un curso significaría
entregar tu cuenta entera.

---

## La integración con Unlock

### Arquitectura

Qupuy **no despliega contratos propios**. El `PublicLock` de Unlock ya es un
ERC-721 completo con todo lo necesario, y el proyecto se apoya en él tal cual.

```
┌─────────────────────────────────────────────────────┐
│  Presentación (App Router)                          │
│  app/page.tsx · app/curso/[slug]                    │
├─────────────────────────────────────────────────────┤
│  Componentes de dominio                             │
│  components/cursos/*                                │
├─────────────────────────────────────────────────────┤
│  Capa de acceso — lo único que conoce Unlock        │
│  hooks/useMembresia · hooks/useComprarAcceso        │
├─────────────────────────────────────────────────────┤
│  Datos (abstraídos)        │  Onchain               │
│  services/content/*        │  contracts/unlock/*    │
└─────────────────────────────────────────────────────┘
                                     ↓
                        Lock de Unlock (Sepolia)
```

**Regla de fronteras:** ningún componente de presentación llama a un contrato
directamente. Todo pasa por la capa de acceso.

### Funciones del PublicLock que usa el proyecto

Los Locks son **PublicLock v14** (`publicLockVersion()` lo confirma on-chain).
Todo lo de abajo está verificado contra el código fuente de esa versión.

| Función | Para qué | Dónde |
| ------- | -------- | ----- |
| `getHasValidKey(address)` | **Determinar el acceso**, en el cliente y en el servidor | `hooks/useMembresia.ts`, `app/api/clase/[moduloId]/route.ts` |
| `totalKeys(address)` | Saber si posee alguna membresía, vigente o vencida, para llegar a su tokenId | `hooks/useMembresia.ts` |
| `tokenOfOwnerByIndex(address, 0)` | Obtener el tokenId del usuario | `hooks/useMembresia.ts` |
| `keyExpirationTimestampFor(tokenId)` | Días restantes | `hooks/useMembresia.ts` |
| `keyManagerOf(tokenId)` | Saber si un acceso es un préstamo | `hooks/useMembresia.ts` |
| `purchasePriceFor(...)`, `keyPrice()` | Precio de la membresía | `hooks/useComprarAcceso.ts` |
| `expirationDuration()`, `tokenAddress()` | Duración y moneda del Lock | `hooks/useComprarAcceso.ts` |
| `purchase(...)` | Comprar la membresía | `hooks/useComprarAcceso.ts` |
| `extend(...)` | Renovar una membresía vencida | `hooks/useComprarAcceso.ts` |
| `transferFrom(from, to, tokenId)` | **Regalar** el acceso | `hooks/useTransferirAcceso.ts` |
| `lendKey(from, to, tokenId)` | **Prestar** el acceso | `hooks/useTransferirAcceso.ts` |
| `unlendKey(to, tokenId)` | Recuperar un préstamo | `hooks/usePrestamos.ts` |
| `totalSupply()` | Accesos vendidos | `hooks/useLinajeAcceso.ts` |
| evento `Transfer` | El linaje del acceso | `hooks/useLinajeAcceso.ts` |

### La decisión técnica central: `getHasValidKey`, nunca `balanceOf`

```typescript
// hooks/useMembresia.ts
const { data: tieneKeyValida } = useReadContract({
  address: lockAddress,
  abi: PUBLIC_LOCK_ABI,
  functionName: "getHasValidKey",   // ← comprueba la expiración dentro del contrato
  args: [address],
});
```

`getHasValidKey` es el contrato explícito de "tiene acceso ahora": comprueba la
expiración y ejecuta los hooks de validez del Lock. `balanceOf` no sirve para
decidir el acceso porque su semántica ha cambiado entre versiones del
PublicLock: en la v14 desplegada aquí solo cuenta keys válidas —recorre las
keys de la wallet y llama a `isValidKey`—, y en versiones anteriores contaba
todas. Apoyar el acceso en ella acoplaría la aplicación a la versión del
contrato.

Para saber si una wallet posee alguna membresía —vigente o vencida— y llegar a
su `tokenId`, Qupuy usa `totalKeys`, que cuenta todas. Así el estado "vencido"
existe de verdad, y la renovación llama a `extend`: Unlock rechaza un
`purchase` cuando ya posees una key, aunque esté vencida (`MAX_KEYS_REACHED`).

### El gating: en el render y en el servidor

```typescript
// app/curso/[slug]/VistaCurso.tsx
const moduloReproducible = tieneAcceso ? moduloActivo : moduloGratuito;
```

Sin membresía válida, ningún reproductor recibe una clase de pago, la lista
deshabilita sus botones y ninguna interacción puede seleccionarlas. La
expresión se recalcula en cada render, lo que la hace correcta también en el
caso difícil: si un usuario con acceso selecciona el módulo 3 y luego pasa su
membresía, la vista vuelve al módulo gratuito de inmediato.

Y las URLs de las clases de pago **no viajan en la página**. El Server
Component las quita antes de pasar el curso al cliente
(`services/content/publico.ts`); cuando el contrato dice que hay acceso, el
cliente las pide a `/api/clase/[id]`, que consulta `getHasValidKey` en el Lock
desde el servidor antes de responder. Abrir el código fuente de un curso sin
membresía no revela ninguna clase de pago.

### Prestar o regalar

Unlock distingue dos formas de pasar una key, y Qupuy expone las dos:

| | Función | Qué pasa |
| - | ------- | -------- |
| **Regalar** | `transferFrom` | Definitivo. El receptor es dueño pleno y puede volver a pasarlo. |
| **Prestar** | `lendKey` | Quien presta sigue siendo el *key manager*: el receptor tiene el acceso, no puede pasarlo a nadie, y el préstamo se recupera con `unlendKey`. |

"Como se presta un libro" deja de ser una metáfora: es una operación del
contrato. Y la pantalla de quien recibe (`/recibir`) consulta el Lock cada
pocos segundos, así que anuncia sola el acceso en cuanto llega.

### El linaje del acceso

Cada transferencia emite un evento `Transfer` en el Lock. Qupuy los lee para
reconstruir la historia completa de un acceso: quién lo compró y por qué manos
ha pasado.

```typescript
// hooks/useLinajeAcceso.ts
const registros = await publicClient.getLogs({
  address: lockAddress,
  event: EVENTO_TRANSFER,
  args: { tokenId },
  fromBlock: BLOQUE_DESPLIEGUE, // no "earliest": los nodos públicos lo rechazan
});
```

En un ERC-721 el primer evento tiene `from = 0x0` — ese es el minteo, la compra
original. Los siguientes son transferencias reales entre personas.

**Esto es lo que ninguna plataforma de cursos puede mostrar.** Udemy no sabe a
quién le prestaste tu cuenta, porque prestar allí significa compartir una
contraseña y eso es invisible para la plataforma. Aquí cada paso es un evento
público y verificable.

### Registro de Locks por red

Las direcciones no están escritas en el código:

```typescript
// contracts/unlock/locks.ts
export const LOCKS_POR_RED: Record<number, Record<string, Address>> = {
  [sepolia.id]: {
    "ingles-basico": leerLock(process.env.NEXT_PUBLIC_LOCK_INGLES),
    // …
  },
};
```

Desplegar en otra red — Base, Avalanche C-Chain — es añadir una entrada, no
reescribir la aplicación.

---

## Locks desplegados

Los tres Locks están desplegados en **Sepolia** (chainId 11155111), con pago en
ETH nativo y membresías de 30 días transferibles.

| Curso | Precio | Dirección del Lock |
| ----- | ------ | ------------------ |
| Inglés desde cero | 0.0001 ETH | [`0x761963f20958660130181fa785ddd6efc64fa862`](https://sepolia.etherscan.io/address/0x761963f20958660130181fa785ddd6efc64fa862) |
| Excel para tu negocio | 0.0001 ETH | [`0x911f1a42bdf3a896aa170a3ab3adde1e015e1eae`](https://sepolia.etherscan.io/address/0x911f1a42bdf3a896aa170a3ab3adde1e015e1eae) |
| Reparación de celulares | 0.0002 ETH | [`0xa00fa3e21a65a77ba17953d88f926b650160313c`](https://sepolia.etherscan.io/address/0xa00fa3e21a65a77ba17953d88f926b650160313c) |

Contrato Unlock en Sepolia: [`0x36b34e10295cCE69B652eEB5a8046041074515Da`](https://sepolia.etherscan.io/address/0x36b34e10295cCE69B652eEB5a8046041074515Da)

---

## Ejecutarlo localmente

Requisitos: Node >= 22.10.0, Yarn, Git.

```bash
git clone https://github.com/mirkovedia/qupuy.git
cd qupuy
yarn install
```

Copia `packages/nextjs/.env.example` a `packages/nextjs/.env.local` y rellena las
direcciones de los Locks:

```
NEXT_PUBLIC_LOCK_INGLES=0x…
NEXT_PUBLIC_LOCK_EXCEL=0x…
NEXT_PUBLIC_LOCK_CELULARES=0x…
```

```bash
yarn start
```

La aplicación queda en `http://localhost:3000`. Necesitas una wallet con ETH de
Sepolia ([faucet de prueba de trabajo](https://sepolia-faucet.pk910.de/)).

### Comandos

```bash
yarn start          # servidor de desarrollo
yarn test           # tests de lógica (22)
yarn next:build     # build de producción
yarn lint           # lint
```

---

## Stack

| | |
| --- | --- |
| Frontend | Next.js 16 (App Router) · React 19 · TypeScript |
| Web3 | wagmi 2.19 · viem 2.53 · RainbowKit |
| Estilos | Tailwind 4 · DaisyUI 5 |
| Base | Scaffold-ETH 2 |
| Tests | Vitest (lógica pura) |

---

## Decisiones de diseño

**Sin contratos propios.** El bounty evalúa la integración con Unlock, no el
volumen de Solidity escrito. Un contrato propio habría añadido superficie de
bugs, tests y despliegue sin sumar nada — el `PublicLock` ya expone todo lo
necesario. El tiempo liberado fue al frontend.

**La capa de datos está abstraída.** El contenido de los cursos vive hoy en un
archivo tipado, pero tras una interfaz `ContentRepository`. Migrar a una base de
datos es reemplazar una implementación, no reescribir la aplicación.

**La interfaz nunca dice "NFT" ni "Key".** Dice "tu acceso vence en 28 días". El
usuario final de Qupuy es un profesor boliviano o su alumno; la tecnología está
debajo, no delante.

**Los tests cubren la lógica pura, no la UI.** Veintidós tests sobre el
cálculo de expiración, la lectura y resolución de Locks, el repositorio de
contenido y el filtrado de clases de pago — donde los bugs son silenciosos. La interfaz se verifica manualmente
contra una lista de escenarios documentada.

**Las lecturas van siempre a la red del Lock; las escrituras exigen la wallet
en ella.** Un usuario con la wallet en otra red sigue viendo su estado. Al
comprar o pasar un acceso, el `chainId` del Lock viaja explícitamente en la
transacción: wagmi rechaza la firma si la wallet está en otra cadena, en lugar
de enviarla donde esté.

---

## Limitación conocida

El endpoint que entrega las clases confía en la dirección que se le indica: no
pide una firma. Alguien que conozca la dirección de un alumno con membresía
podría pedir las URLs en su nombre. Y los archivos de video son estáticos: quien
conozca una ruta puede descargarla.

Es aceptable en una demo. La ruta de producción es autenticar la wallet por
firma (SIWE) y responder con URLs firmadas de expiración corta.

Se documenta aquí porque un jurado técnico lo notaría, y ocultarlo sería peor
que reconocerlo.

---

## Código preexistente

Conforme al Código de Conducta de Devfolio, se declara el código que no se
escribió durante la hackathon.

**Preexistente:**

- **Scaffold-ETH 2** (MIT) — estructura del monorepo, configuración de Hardhat y
  Next.js, hooks de interacción con contratos, componentes web3 (`Address`,
  `AddressInput`, `Balance`, `EtherInput`), páginas `/debug` y `/blockexplorer`,
  burner wallet y faucet local.
- **Guías de patrones** incluidas en el repositorio base (`.agents/skills/`),
  usadas como referencia de implementación.
- Dependencias estándar: wagmi, viem, RainbowKit, DaisyUI, Vitest.
- **Material de video:** clips de [Mixkit](https://mixkit.co/), bajo su licencia
  libre, que no exige atribución. Se usan como contenido de demostración de las
  clases.
- **Tipografías:** Fraunces, Inter y JetBrains Mono, todas de licencia abierta.

**Escrito durante la hackathon:**

```
packages/nextjs/
├── app/                               ├── hooks/
│   ├── page.tsx  (reescrito)          │   ├── useMembresia.ts
│   ├── curso/[slug]/page.tsx          │   ├── useComprarAcceso.ts
│   ├── curso/[slug]/VistaCurso.tsx    │   ├── useTransferirAcceso.ts
│   ├── mi-acceso/page.tsx             │   ├── usePrestamos.ts
│   ├── mi-acceso/ListaAccesos.tsx     │   ├── useLinajeAcceso.ts
│   ├── recibir/page.tsx               │   ├── useAccesosDe.ts
│   ├── recibir/PantallaRecibir.tsx    │   ├── useUrlDeClase.ts
│   ├── api/clase/[moduloId]/route.ts  │   └── useRedDelLock.ts
│   ├── debug/page.tsx  (reescrito)    │
│   └── not-found.tsx  (reescrito)     ├── services/content/types.ts
├── components/                        ├── services/content/staticRepository.ts
│   ├── LogoQupuy.tsx                  ├── services/content/publico.ts
│   └── cursos/                        ├── services/content/index.ts
│       │                              ├── services/web3/clienteServidor.ts
│       ├── AvisoRed.tsx               ├── contracts/unlock/publicLockAbi.ts
│       ├── BotonDesbloquear.tsx       ├── contracts/unlock/locks.ts
│       ├── CadenaDemostrativa.tsx     ├── contracts/externalContracts.ts
│       ├── CursoCard.tsx              │
│       ├── EscanerDireccion.tsx       ├── utils/membresia.ts
│       ├── EstadoMembresia.tsx        ├── types/curso.ts
│       ├── LinajeAcceso.tsx           └── data/cursos.ts
│       ├── ListaModulos.tsx
│       ├── ModalTransferir.tsx
│       ├── ReproductorVideo.tsx
│       ├── TarjetaAcceso.tsx
│       └── TarjetaCompartir.tsx
```

Más sus tests. Toda la lógica de negocio, el diseño del sistema y la interfaz
son originales. No se ha reutilizado código de proyectos previos del autor ni de
submissions a otras hackathons.

---

## Enlaces

- [Unlock Protocol](https://unlock-protocol.com/) · [documentación](https://docs.unlock-protocol.com/)
- [Scaffold-ETH 2](https://docs.scaffoldeth.io)
- [Sistema de contexto del proyecto](docs/CONTEXTO-IA.md) — cómo se desarrolló con asistencia de IA
