# Qupuy

**Cursos con acceso transferible, sobre Unlock Protocol.**

> **Qupuy** (quechua): *dar a otro, entregar* — y también *pagar*.
> Una sola palabra para las dos acciones centrales del producto.

Portal de cursos donde el acceso es una membresía de Unlock que el alumno
**posee** y puede pasarle a otra persona. Como se presta un libro.

**ETH Bolivia Buildathon 2026 · Cochabamba** — Track de Unlock Protocol,
Bounty 2: Portal de Contenido Token-Gated.

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

| Función | Para qué | Dónde |
| ------- | -------- | ----- |
| `getHasValidKey(address)` | **Determinar el acceso** | `hooks/useMembresia.ts` |
| `balanceOf(address)` | Saber si posee alguna membresía (para obtener su tokenId) | `hooks/useMembresia.ts` |
| `tokenOfOwnerByIndex(address, 0)` | Obtener el tokenId del usuario | `hooks/useMembresia.ts` |
| `keyExpirationTimestampFor(tokenId)` | Días restantes | `hooks/useMembresia.ts` |
| `keyPrice()` | Precio de la membresía | `hooks/useComprarAcceso.ts` |
| `purchase(...)` | Comprar la membresía | `hooks/useComprarAcceso.ts` |
| `transferFrom(from, to, tokenId)` | Pasar el acceso a otra persona | `hooks/useTransferirAcceso.ts` |

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

`balanceOf` devuelve 1 aunque la membresía esté vencida, porque el NFT permanece
en la wallet tras expirar. Solo `getHasValidKey` comprueba la validez temporal.

El proyecto usa `balanceOf` únicamente para averiguar si el usuario posee alguna
membresía y así poder consultar su `tokenId`. **Nunca para decidir el acceso.**

### El gating es real, no cosmético

```typescript
// app/curso/[slug]/VistaCurso.tsx
const moduloReproducible = tieneAcceso ? moduloActivo : moduloGratuito;
```

Cuando el visitante no tiene membresía, **las URLs de los módulos de pago nunca
llegan al navegador**. No se renderizan ni se ocultan con CSS: sencillamente no
existen en la página.

La expresión se recalcula en cada render, lo que la hace correcta también en el
caso difícil: si un usuario con acceso selecciona el módulo 3 y luego transfiere
su membresía, la vista vuelve al módulo gratuito de inmediato.

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
yarn test           # tests de lógica (15)
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

**Los tests cubren la lógica pura, no la UI.** Quince tests sobre el cálculo de
expiración, la resolución de Locks y el repositorio de contenido — donde los
bugs son silenciosos. La interfaz se verifica manualmente contra una lista de
escenarios documentada.

---

## Limitación conocida

Con contenido servido estáticamente, las URLs de los videos son descubribles
mediante las herramientas de desarrollo del navegador. Es aceptable y habitual
en una demo; la ruta de producción son URLs firmadas con expiración corta,
emitidas por un endpoint que valida la membresía del lado del servidor antes de
entregarlas.

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

**Escrito durante la hackathon:**

```
packages/nextjs/
├── app/curso/[slug]/page.tsx          ├── hooks/useMembresia.ts
├── app/curso/[slug]/VistaCurso.tsx    ├── hooks/useComprarAcceso.ts
├── components/cursos/ModalTransferir.tsx   ├── hooks/useTransferirAcceso.ts
├── components/cursos/TarjetaAcceso.tsx    ├── app/mi-acceso/page.tsx
├── app/mi-acceso/ListaAccesos.tsx
├── app/page.tsx  (reescrito)          ├── services/content/types.ts
├── components/cursos/BotonDesbloquear.tsx  ├── services/content/staticRepository.ts
├── components/cursos/CursoCard.tsx    ├── services/content/index.ts
├── components/cursos/EstadoMembresia.tsx   ├── contracts/unlock/publicLockAbi.ts
├── components/cursos/ListaModulos.tsx ├── contracts/unlock/locks.ts
├── components/cursos/ReproductorVideo.tsx  ├── utils/membresia.ts
├── data/cursos.ts                     └── types/curso.ts
```

Más sus tests. Toda la lógica de negocio, el diseño del sistema y la interfaz
son originales. No se ha reutilizado código de proyectos previos del autor ni de
submissions a otras hackathons.

---

## Enlaces

- [Unlock Protocol](https://unlock-protocol.com/) · [documentación](https://docs.unlock-protocol.com/)
- [Scaffold-ETH 2](https://docs.scaffoldeth.io)
- [Sistema de contexto del proyecto](docs/CONTEXTO-IA.md) — cómo se desarrolló con asistencia de IA
