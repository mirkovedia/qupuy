# 🏗 Etherumbo — Hackathon web3 · Cochabamba, Bolivia

> Repositorio del proyecto para la hackathon **Etherumbo**, construido sobre
> Scaffold-ETH 2 (Hardhat + Next.js).
> **Desarrollo asistido por IA.** Ahora mismo: solo Claude Code.
> El sistema de contexto soporta Codex en paralelo si se suma más adelante.
>
> **Si eres una IA: lee [`CONTEXT.md`](CONTEXT.md) antes que nada, luego [`AGENTS.md`](AGENTS.md).**

| | |
| --- | --- |
| **Evento** | Etherumbo — Cochabamba, Bolivia |
| **Fecha** | **2026-09-11 — EN CURSO** · 48 horas · cierre 2026-09-13 |
| **Tracks** | ⚠️ pendientes de recibir — tema general: web3 |
| **Participación** | Individual (dev + Claude Code) |
| **Plataforma** | Devfolio — aplica su Code of Conduct (ver [`CONTEXT.md`](CONTEXT.md) §2) |
| **Stack** | Next.js (App Router) · React · TypeScript · Wagmi · Viem · RainbowKit · Tailwind + DaisyUI |
| **Contratos** | Solidity + Hardhat (`hardhat-deploy`) |
| **Monorepo** | Yarn 4 workspaces — `packages/hardhat`, `packages/nextjs` |
| **Node** | >= 22.10.0 |
| **Fase** | 🔴 **HACKATHON EN CURSO** — fase 0, esperando tracks |

---

## 🔴 Reloj corriendo — 48 horas

La hackathon arrancó el **2026-09-11** y dura **48 horas**. Los tracks aún no se
anuncian, así que el proyecto sigue sin definir.

### El presupuesto real no son 48 horas

Descontando descanso, comidas y la preparación de la demo, quedan unas
**30-32 horas productivas**. Planificar sobre 48 es la forma más común de no
terminar. El plan de fases completo está en [`CONTEXT.md`](CONTEXT.md) §4:

| Fase | Horas | Qué pasa |
| ---- | ----- | -------- |
| 0 — Hora cero | 0-2 | Checklist, `git init`, deploy de prueba a testnet |
| 1 — Decisión | 2-4 | Salen los tracks → elegir y definir scope (máx. 2h) |
| 2 — Contratos | 4-14 | Solidity + tests + deploy local |
| 3 — Frontend P0 | 14-26 | 🎯 Flujo completo funcionando, aunque sea feo |
| 4 — Testnet | 26-32 | Deploy + verificación + frontend publicado |
| 5 — P1 y pulido | 32-42 | Solo si P0 está cerrado |
| 6 — Demo | 42-48 | 🔴 Intocable. Guión y ensayo, nada de código |

**Cortes duros:** hora 26 sin P0 funcionando → recortar ya. Hora 32 → congelar
funcionalidades. Hora 42 → congelar código.

### Ahora mismo (fase 0)

1. **Ejecutar el checklist de [`CONTEXT.md`](CONTEXT.md) §8.** Es lo único
   productivo hasta que salgan los tracks, y evita descubrir un entorno roto
   en la hora 20.
2. `git init` + primer commit.
3. Revisar las reglas de reutilización de código ([`CONTEXT.md`](CONTEXT.md) §2)
   y la plantilla de declaración para el submission (§10).

### Cuando anuncien los tracks

1. Elegir track → registrar la decisión en [`CONTEXT.md`](CONTEXT.md) §6.
2. Consultar el [mapa skill → tipo de proyecto](#-mapa-skill--tipo-de-proyecto) de abajo.
3. Definir scope **con cortes** en [`CONTEXT.md`](CONTEXT.md) §5 — antes de escribir código.
4. Leer la skill correspondiente, y recién ahí implementar.

---

## 🗺 Mapa skill → tipo de proyecto

Las 8 skills del repo cubren buena parte de los tracks típicos de una hackathon
web3. Esta tabla existe para decidir rápido: cuando salga el track, buscas la
fila y ya sabes qué leer.

| Si el track va de… | Skill | Qué te resuelve | Arranque |
| --- | --- | --- | --- |
| **NFTs, coleccionables, arte, ticketing, credenciales** | `erc-721` | Colección completa: minteo, galería, transferencias. Cubre reentrancy en `_safeMint`, SVG on-chain, metadata de marketplaces | 🟢 Rápido |
| **Identidad, login, reputación, comunidad** | `siwe` | Login con wallet (EIP-4361) y sesiones. Usa `viem/siwe` nativo | 🟢 Rápido |
| **Tokens, DeFi, gobernanza, staking** | `openzeppelin` | ERC20/721/1155, Ownable, AccessControl, Pausable, ReentrancyGuard — con patrones leídos del código instalado | 🟢 Rápido |
| **UX de wallet, onboarding, abstracción de cuenta** | `eip-5792` | Transacciones batch, `wallet_sendCalls`, paymasters (gas patrocinado), ERC-7677 | 🟡 Medio |
| **Pagos, micropagos, monetizar APIs** | `x402` | Rutas con HTTP 402 y pago en stablecoins vía middleware de Next.js | 🟡 Medio |
| **Datos on-chain, analítica, dashboards** | `ponder` | Indexa eventos y los sirve por GraphQL. Lee los contratos desplegados de SE-2 automáticamente | ⛔ No con 48h |
| **Datos on-chain (alternativa descentralizada)** | `subgraph` | The Graph: subgraph local con Docker o deploy a Subgraph Studio | ⛔ No con 48h |
| **Cualquier cosa con datos off-chain** | `drizzle-neon` | PostgreSQL con Drizzle ORM + Neon serverless. Perfil de usuario, caché, contenido | 🟡 Medio |

**Cómo leer la columna de arranque, con 48 horas:**

- 🟢 **Rápido** — la skill trae el patrón completo, sin infraestructura nueva. **Elige de aquí.**
- 🟡 **Medio** — dependencias nuevas o configuración, sin servicios aparte. Viable como complemento de un 🟢.
- ⛔ **No recomendado con 48h** — `ponder` y `subgraph` exigen Docker y un workspace
  nuevo: entre 4 y 6 horas antes de ver el primer dato. No las recuperas.

> **Si el track pide datos on-chain**, usa `useScaffoldEventHistory` — ya viene en
> SE-2, lee el historial de eventos sin infraestructura y cubre el 80% del caso.
> Un indexador solo se justifica si el track lo exige explícitamente.

> **Combinar es lo normal**, pero con 48h el límite realista son **dos skills**:
> una 🟢 de base y como mucho una 🟡. Por ejemplo `openzeppelin` + `erc-721`
> para NFTs, o `openzeppelin` + `siwe` para identidad con login.

### Lo que SE-2 ya te da gratis

No lo reconstruyas — ya está y funciona:

- **Burner wallet y faucet local** — probar sin MetaMask ni fondos reales.
- **Página `/debug`** — interactuar con cualquier función del contrato sin escribir UI.
- **Block explorer local** en `/blockexplorer`.
- **Hot reload de contratos** — el frontend se adapta solo al editar el contrato.
- **Componentes web3** — `Address`, `AddressInput`, `Balance`, `EtherInput` con ENS y conversión USD resueltos.

En una demo, `/debug` te salva: si la UI de una función no llegó a tiempo, la enseñas ahí.

---

## 🤖 Cómo funciona el contexto entre Claude Code y Codex

El problema: dos IAs sobre el mismo repositorio en sesiones separadas no
comparten memoria. Cada una arranca en frío. La solución son **cuatro archivos
con responsabilidades distintas** — ninguno duplica al otro.

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTEXT.md          ← estado MUTABLE. Cambia cada sesión.      │
│  track, scope, decisiones, qué está a medias, handoff.          │
│  Lo leen TODAS las IAs al arrancar. Lo actualizan al terminar.  │
├─────────────────────────────────────────────────────────────────┤
│  AGENTS.md           ← reglas ESTABLES. Cambia rara vez.        │
│  comandos, arquitectura, convenciones, índice de skills,        │
│  protocolo multi-IA.                                            │
│  Lo leen Codex · Cursor · OpenCode (convención `AGENTS.md`).    │
├─────────────────────────────────────────────────────────────────┤
│  CLAUDE.md           ← solo hace `@AGENTS.md`. NO duplicar.     │
│  Claude Code lee este, que importa el anterior.                 │
├─────────────────────────────────────────────────────────────────┤
│  README.md (aquí)    ← onboarding humano + este mapa.           │
└─────────────────────────────────────────────────────────────────┘
```

### La regla de oro

> **El código dice _qué_ existe. `CONTEXT.md` dice _por qué_, _qué falta_ y _quién lo tocó último_.**

Un diff de git no explica por qué se descartó una alternativa, ni qué quedó a
medias, ni qué no hay que tocar. Eso vive en `CONTEXT.md`.

### Protocolo de relevo (obligatorio para ambas IAs)

**Al empezar cualquier sesión:**

1. Leer [`CONTEXT.md`](CONTEXT.md) — sobre todo §7 *Handoff*, el mensaje de la IA
   anterior, y §4 *Plan de las 48 horas* para saber en qué fase estás.
2. Leer [`AGENTS.md`](AGENTS.md) si es la primera sesión o si cambió.
3. Si la tarea coincide con una skill, **leerla antes de escribir código**.

**Al terminar cualquier sesión:**

1. Sobrescribir §7 *Handoff* — qué hice / qué dejé a medias / qué sigue / qué NO tocar.
2. Decisión no evidente en el código → fila nueva en §6 *Decisiones*.
   **Nunca borrar filas**; marcar `[REVERTIDA]` con el motivo si se deshace.
3. Cambió el estado → actualizar §3 *Estado actual*.
4. Término de dominio nuevo → registrarlo en §9 *Glosario*.

**Frase para arrancar una sesión, en cualquiera de las dos IAs:**

```
Lee CONTEXT.md y AGENTS.md antes de empezar. Luego: <tu tarea>.
```

**Frase para cerrarla:**

```
Actualiza el handoff en CONTEXT.md con lo que hiciste.
```

> **Durante la hackathon esto importa más que nunca.** Bajo presión de tiempo,
> el error caro es que una IA rehaga o rompa lo que la otra acaba de dejar
> funcionando. La sección "qué NO tocar" del handoff es la que lo previene.

---

## 🧠 Skills y agentes

Las skills son guías de implementación con patrones verificados y APIs
actualizadas. **Léelas antes de implementar** — evitan que la IA invente APIs
desde conocimiento pre-entrenado que puede estar desactualizado.

### Dónde vive cada cosa

| Ruta | Contenido | Editar aquí |
| ---- | --------- | ----------- |
| `.agents/skills/<name>/SKILL.md` | **Contenido real de las skills** | ✅ Sí |
| `.agents/agents/<name>.md` | **Contenido real de los agentes** | ✅ Sí |
| `.claude/skills/<name>/SKILL.md` | Wrapper → `@.agents/skills/...` | ❌ Solo frontmatter |
| `.claude/agents/<name>.md` | Wrapper con `tools:` y `color:` | ❌ Solo frontmatter |
| `.cursor/agents/`, `.opencode/agents/` | Wrappers por harness | ❌ Solo frontmatter |

> **Una sola fuente de verdad.** Si editas una skill o un agente, edítalo en
> `.agents/`. Los wrappers lo importan con `@` y se actualizan solos.

**Cómo invocarlas:**

- **Claude Code** → auto-descubiertas vía `.claude/skills/`. También `/openzeppelin`, `/siwe`, etc.
- **Codex / Cursor / OpenCode** → `lee .agents/skills/<name>/SKILL.md antes de implementar`.

### Agentes

| Agente | Para qué |
| ------ | -------- |
| **grumpy-carlos-code-reviewer** | Code review exigente de TypeScript, React, Next.js y Solidity con las convenciones de SE-2. Invocarlo **después** de escribir o modificar código |

> En hackathon, úsalo sobre los contratos antes de desplegar a testnet. Un bug
> de seguridad en Solidity descubierto por el jurado cuesta más que los 5 minutos
> que tarda la revisión.

### MCP — documentación actualizada

**Context7** está configurado en los tres harnesses (`.mcp.json`, `.cursor/mcp.json`,
`opencode.json`). Sirve documentación al día de Wagmi, Viem, RainbowKit, DaisyUI,
Hardhat, Next.js y demás.

> Úsalo en lugar de responder de memoria cuando la pregunta sea sobre la API de
> una librería. El conocimiento pre-entrenado envejece; Context7 no.

---

## 🚀 Arranque rápido

Requisitos: [Node >= 22.10.0](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/getting-started/install), [Git](https://git-scm.com/downloads).

```bash
yarn install
```

Después, **tres terminales**:

```bash
yarn chain      # terminal 1 — blockchain local (Hardhat Network)
yarn deploy     # terminal 2 — despliega los contratos al chain local
yarn start      # terminal 3 — frontend en http://localhost:3000
```

El frontend queda en `http://localhost:3000`. La página `/debug` te deja
interactuar con los contratos desplegados sin escribir UI.

### Comandos frecuentes

```bash
# Desarrollo
yarn chain                      # blockchain local
yarn deploy                     # despliega al chain local
yarn deploy --tags MiContrato   # despliega solo un contrato (por su tag)
yarn start                      # frontend en dev

# Calidad
yarn lint                       # lint de ambos packages
yarn format                     # formatea ambos packages
yarn test                       # tests de contratos (Hardhat)
yarn compile                    # compila Solidity

# Cuentas
yarn generate                   # genera cuenta deployer nueva
yarn account:import             # importa una private key existente
yarn account                    # info de la cuenta actual

# Redes reales
yarn deploy --network sepolia   # despliega a testnet/mainnet
yarn verify --network sepolia   # verifica contratos en el explorer
yarn vercel:yolo --prod         # despliega el frontend
```

---

## 📁 Estructura

```
stack-a-scaffold-eth2/
├── CONTEXT.md                  ← 🔴 bitácora compartida entre IAs — LEER PRIMERO
├── AGENTS.md                   ← 🔴 reglas del repo (Codex/Cursor/OpenCode)
├── CLAUDE.md                   ←    importa AGENTS.md (Claude Code)
├── README.md                   ←    este archivo
├── README.scaffold-eth.md      ←    README original de SE-2 (referencia upstream)
│
├── .agents/                    ← ✅ FUENTE DE VERDAD de skills y agentes
│   ├── skills/                 ←    8 skills (openzeppelin, erc-721, siwe, …)
│   └── agents/                 ←    grumpy-carlos-code-reviewer
├── .claude/                    ←    wrappers para Claude Code
├── .cursor/  .opencode/        ←    wrappers para Cursor y OpenCode
├── .mcp.json                   ←    Context7 MCP
│
└── packages/
    ├── hardhat/
    │   ├── contracts/          ← 📝 tus contratos Solidity
    │   ├── deploy/             ← 📝 scripts de deploy (hardhat-deploy, snake_case)
    │   ├── test/               ← 📝 tests de contratos
    │   └── hardhat.config.ts   ←    redes y configuración
    └── nextjs/
        ├── app/                ← 📝 páginas (App Router)
        ├── components/         ← 📝 tus componentes
        ├── hooks/scaffold-eth/ ← ⛔ core de SE-2 — no editar
        ├── contracts/
        │   ├── deployedContracts.ts   ← ⛔ AUTOGENERADO por `yarn deploy`
        │   └── externalContracts.ts   ← 📝 contratos externos, a mano
        └── scaffold.config.ts  ←    red objetivo, polling, API keys
```

Leyenda: 📝 escribe aquí · ⛔ no tocar · ✅ fuente de verdad

---

## ⚙️ Convenciones que ambas IAs deben respetar

Detalle completo en [`AGENTS.md`](AGENTS.md). Resumen de lo que más se incumple:

### Hooks de contratos — usar siempre los de SE-2

```tsx
// ✅ correcto
const { data } = useScaffoldReadContract({ contractName: "YourContract", functionName: "greeting" });
const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourContract" });

// ❌ nombres que NO existen (error común de las IAs)
useScaffoldContractRead   //  → useScaffoldReadContract
useScaffoldContractWrite  //  → useScaffoldWriteContract
```

Disponibles: `useScaffoldReadContract`, `useScaffoldWriteContract`,
`useScaffoldEventHistory`, `useScaffoldWatchContractEvent`,
`useDeployedContractInfo`, `useScaffoldContract`, `useTransactor`.

### Componentes web3 — importar de `@scaffold-ui/components`

```tsx
// ✅ correcto
import { Address, AddressInput, Balance, EtherInput } from "@scaffold-ui/components";

// ❌ patrón viejo
import { Address } from "~~/components/scaffold-eth";
```

Nunca construyas un display de address, un input de address ni un input de ETH
a mano — ya existen y resuelven ENS, avatares y conversión USD.

### Estilos — DaisyUI antes que Tailwind crudo

```tsx
<button className="btn btn-primary">Conectar</button>
```

Usa colores semánticos de DaisyUI (`bg-base-100`, `text-base-content`,
`btn-error`) en lugar de colores crudos de Tailwind — así el tema oscuro
funciona solo.

### TypeScript

- `type` antes que `interface`.
- Sin prefijo `T` en los tipos: `Address`, no `TAddress`.
- Alias `~~` para el package nextjs: `import { useTargetNetwork } from "~~/hooks/scaffold-eth";`
- Nada de `any`.

### Solidity

- `custom errors` en vez de strings en `require` (más barato en gas).
- `external` antes que `public` cuando la función no se llama internamente.
- Patrón CEI (Checks-Effects-Interactions) en llamadas externas.
- Eventos en todo cambio de estado relevante.
- Sin loops sin cota.

### Nomenclatura

| Estilo | Dónde |
| ------ | ----- |
| `UpperCamelCase` | clases, tipos, enums, componentes React |
| `lowerCamelCase` | variables, parámetros, funciones, propiedades |
| `CONSTANT_CASE` | constantes y globales |
| `snake_case` | archivos de `packages/hardhat/deploy/` |

---

## 🔗 Referencias

- [Documentación de Scaffold-ETH 2](https://docs.scaffoldeth.io)
- [README original de SE-2](README.scaffold-eth.md) — quickstart upstream
- [Wagmi](https://wagmi.sh/) · [Viem](https://viem.sh/) · [DaisyUI](https://daisyui.com/components) · [RainbowKit](https://rainbowkit.com/)
- [CONTRIBUTING.md](CONTRIBUTING.md) — guía de contribución de SE-2 upstream
