# AGENTS.md

## ⚠️ PROTOCOLO OBLIGATORIO — Trabajo con múltiples IAs

Este repositorio es el proyecto para la hackathon **Etherumbo** (Cochabamba,
Bolivia), organizada en **Devfolio**. Desarrollo asistido por IA — ahora mismo
solo **Claude Code**; el sistema de contexto soporta Codex en paralelo si se
suma más adelante.

🔴 **La hackathon está EN CURSO**: arrancó el 2026-09-11 y dura **48 horas**.
Consulta siempre §4 de `CONTEXT.md` para saber en qué fase estás — lo que es
correcto en la hora 10 es un error en la hora 40.

Antes de cualquier otra cosa:

1. **AL INICIAR SESIÓN — lee `CONTEXT.md`.** Contiene las reglas del evento
   (§2), el plan de las 48 horas (§4), el track elegido, el scope con sus cortes
   (§5), las decisiones tomadas (§6) y el mensaje de handoff (§7) que dejó la IA
   anterior. El código te dice *qué* existe; `CONTEXT.md` te dice *por qué*
   y *qué falta*. No escribas código sin leerlo.

2. **AL TERMINAR — actualiza `CONTEXT.md`.** Como mínimo la sección
   **§7 Handoff** (sobrescríbela: es un relevo, no un log). Si tomaste una
   decisión que no es evidente leyendo el código, añade una fila a **§6
   Decisiones**. Si cambió el estado del proyecto, actualiza **§3 Estado actual**.
   Si creaste archivos de código propio, añádelos a la declaración de **§10**.

3. **Ante un conflicto entre `CONTEXT.md` y el código, gana el código** —
   pero avísalo en el handoff para que la bitácora se corrija.

4. **Nunca borres entradas de la tabla de Decisiones.** Si algo se revierte,
   márcalo `[REVERTIDA]` con el motivo. Así la otra IA no vuelve a proponer
   lo mismo.

5. **Usa el glosario** (§9 de `CONTEXT.md`). Si introduces un término de dominio
   nuevo, regístralo ahí para que ambas IAs lo usen igual.

### Contexto de hackathon — implicaciones prácticas

- **48 horas ≈ 30-32 horas productivas.** Descontando descanso, comidas y la
  preparación de la demo. No planifiques sobre 48.
- **Cortes duros del reloj** (§4): hora 26 sin P0 funcionando → recortar scope
  de inmediato. Hora 32 → congelar funcionalidades, solo bugs. Hora 42 →
  congelar código por completo, todo a la demo.
- **El scope tiene prioridades** (§5 de `CONTEXT.md`): P0 nunca se corta,
  P2 se corta primero. No implementes P2 si P0 no está terminado.
- **Con 48h, `ponder` y `subgraph` no son viables** (4-6h solo de infraestructura).
  Si hace falta leer eventos, usa `useScaffoldEventHistory`, que ya viene en SE-2.
- **La demo manda.** Un flujo completo y modesto vale más que uno ambicioso y
  roto. Si algo no llega, la página `/debug` de SE-2 permite demostrar la
  función del contrato sin UI propia.
- **Respeta "qué NO tocar" del handoff.** Bajo presión de tiempo, el error más
  caro es rehacer o romper lo que la otra IA acaba de dejar funcionando.
- **Antes de desplegar contratos a testnet**, pasa el agente
  `grumpy-carlos-code-reviewer` sobre el código Solidity.

### 🔴 Regla del evento: código original

El Code of Conduct de Devfolio (§2 de `CONTEXT.md`) exige que el proyecto se
haya desarrollado **durante la hackathon**, y que todo código preexistente se
**declare** en el submission. No declararlo puede causar descalificación.

- **Escribe código original.** Usar patrones de las skills o de la documentación
  oficial está bien; copiar código de otros repositorios o de proyectos previos
  del dev, no.
- **Al crear un archivo propio**, añádelo a la lista de código original en
  §10 de `CONTEXT.md`. Mantenerla al día cuesta segundos; reconstruirla al final,
  horas.

**Jerarquía de contexto en este repo:**

| Archivo | Qué contiene | Quién lo lee |
| ------- | ------------ | ------------ |
| `CONTEXT.md` | Estado **mutable**: reglas del evento, plan de 48h, track, scope, decisiones, handoff | Todas las IAs — **primero** |
| `AGENTS.md` (este archivo) | Reglas **estables**: comandos, arquitectura, convenciones | Codex, Cursor, OpenCode |
| `CLAUDE.md` | Solo importa `AGENTS.md` — no duplicar nada aquí | Claude Code |
| `README.md` | Onboarding humano + mapa skill → tipo de proyecto | Personas |


This file provides guidance to coding agents working in this repository.

## Project Overview

Scaffold-ETH 2 (SE-2) is a starter kit for building dApps on Ethereum. It comes in **two flavors** based on the Solidity framework:

- **Hardhat flavor**: Uses `packages/hardhat` with hardhat-deploy plugin
- **Foundry flavor**: Uses `packages/foundry` with Forge scripts

Both flavors share the same frontend package:

- **packages/nextjs**: React frontend (Next.js App Router, not Pages Router, RainbowKit, Wagmi, Viem, TypeScript, Tailwind CSS with DaisyUI)

### Detecting Which Flavor You're Using

Check which package exists in the repository:

- If `packages/hardhat` exists → **Hardhat flavor** (follow Hardhat instructions)
- If `packages/foundry` exists → **Foundry flavor** (follow Foundry instructions)

## Common Commands

Commands work the same for both flavors unless noted otherwise:

```bash
# Development workflow (run each in separate terminal)
yarn chain          # Start local blockchain (Hardhat or Anvil)
yarn deploy         # Deploy contracts to local network
yarn start          # Start Next.js frontend at http://localhost:3000

# Code quality
yarn lint           # Lint both packages
yarn format         # Format both packages

# Building
yarn next:build     # Build frontend
yarn compile        # Compile Solidity contracts

# Contract verification (works for both)
yarn verify --network <network>

# Account management (works for both)
yarn generate            # Generate new deployer account
yarn account:import      # Import existing private key
yarn account             # View current account info

# Deploy to live network
yarn deploy --network <network>   # e.g., sepolia, mainnet, base

yarn vercel:yolo --prod # for deployment of frontend
```

## Architecture

### Smart Contract Development

#### Hardhat Flavor

- Contracts: `packages/hardhat/contracts/`
- Deployment scripts: `packages/hardhat/deploy/` (uses hardhat-deploy plugin)
- Tests: `packages/hardhat/test/`
- Config: `packages/hardhat/hardhat.config.ts`
- Deploying specific contract:
  - If the deploy script has:
    ```typescript
    // In packages/hardhat/deploy/01_deploy_my_contract.ts
    deployMyContract.tags = ["MyContract"];
    ```
  - `yarn deploy --tags MyContract`
  - **Gas limit in deploy scripts**: Manual post-deploy calls (e.g. `transferOwnership`, `grantRole`, `initialize`) can silently inherit `blockGasLimit` as their gas cap, causing failures. **Fix at the call site, not in `hardhat.config.ts`:**
    ```typescript
    // Preferred: estimateGas + 20% margin
    const gas = await myContract.myMethod.estimateGas(arg1, arg2);
    await myContract.myMethod(arg1, arg2, { gasLimit: (gas * 120n) / 100n });

    // Or: explicit limit for simple admin calls
    await myContract.transferOwnership(newOwner, { gasLimit: 100_000 });
    ```

#### Foundry Flavor

- Contracts: `packages/foundry/contracts/`
- Deployment scripts: `packages/foundry/script/` (uses custom deployment strategy)
  - Example: `packages/foundry/script/Deploy.s.sol` and `packages/foundry/script/DeployYourContract.s.sol`
- Tests: `packages/foundry/test/`
- Config: `packages/foundry/foundry.toml`
- Deploying a specific contract:
  - Create a separate deployment script and run `yarn deploy --file DeployYourContract.s.sol`

#### Both Flavors

- After `yarn deploy`, ABIs are auto-generated to `packages/nextjs/contracts/deployedContracts.ts`

### Frontend Contract Interaction

**Correct interact hook names (use these):**

- `useScaffoldReadContract` - NOT ~~useScaffoldContractRead~~
- `useScaffoldWriteContract` - NOT ~~useScaffoldContractWrite~~

Contract data is read from two files in `packages/nextjs/contracts/`:

- `deployedContracts.ts`: Auto-generated from deployments
- `externalContracts.ts`: Manually added external contracts

#### Reading Contract Data

```typescript
const { data: totalCounter } = useScaffoldReadContract({
  contractName: "YourContract",
  functionName: "userGreetingCounter",
  args: ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045"],
});
```

#### Writing to Contracts

```typescript
const { writeContractAsync, isPending } = useScaffoldWriteContract({
  contractName: "YourContract",
});

await writeContractAsync({
  functionName: "setGreeting",
  args: [newGreeting],
  value: parseEther("0.01"), // for payable functions
});
```

#### Reading Events

```typescript
const { data: events, isLoading } = useScaffoldEventHistory({
  contractName: "YourContract",
  eventName: "GreetingChange",
  watch: true,
  fromBlock: 31231n,
  blockData: true,
});
```

SE-2 also provides other hooks to interact with blockchain data: `useScaffoldWatchContractEvent`, `useScaffoldEventHistory`, `useDeployedContractInfo`, `useScaffoldContract`, `useTransactor`.

**IMPORTANT: Always use hooks from `packages/nextjs/hooks/scaffold-eth` for contract interactions. Always refer to the hook names as they exist in the codebase.**

### UI Components

**Always use `@scaffold-ui/components` library for web3 UI components:**

- `Address`: Display ETH addresses with ENS resolution, blockie avatars, and explorer links
- `AddressInput`: Input field with address validation and ENS resolution
- `Balance`: Show ETH balance in ether and USD
- `EtherInput`: Number input with ETH/USD conversion toggle
- `IntegerInput`: Integer-only input with wei conversion

### Notifications & Error Handling

Use `notification` from `~~/utils/scaffold-eth` for success/error/warning feedback and `getParsedError` for readable error messages.

### Styling

**Use DaisyUI classes** for building frontend components.

```tsx
// ✅ Good - using DaisyUI classes
<button className="btn btn-primary">Connect</button>
<div className="card bg-base-100 shadow-xl">...</div>

// ❌ Avoid - raw Tailwind when DaisyUI has a component
<button className="px-4 py-2 bg-blue-500 text-white rounded">Connect</button>
```

### Configure Target Network before deploying to testnet / mainnet.

#### Hardhat

Add networks in `packages/hardhat/hardhat.config.ts` if not present.

#### Foundry

Add RPC endpoints in `packages/foundry/foundry.toml` if not present.

#### NextJs

Add networks in `packages/nextjs/scaffold.config.ts` if not present. This file also contains configuration for polling interval, API keys. Remember to decrease the polling interval for L2 chains.

## Code Style Guide

### Identifiers

| Style            | Category                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `UpperCamelCase` | class / interface / type / enum / decorator / type parameters / component functions in TSX / JSXElement type parameter |
| `lowerCamelCase` | variable / parameter / function / property / module alias                                                              |
| `CONSTANT_CASE`  | constant / enum / global variables                                                                                     |
| `snake_case`     | for hardhat deploy files and foundry script files                                                                      |

### Import Paths

Use the `~~` path alias for imports in the nextjs package:

```tsx
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
```

### Creating Pages

```tsx
import type { NextPage } from "next";

const Home: NextPage = () => {
  return <div>Home</div>;
};

export default Home;
```

### TypeScript Conventions

- Use `type` over `interface` for custom types
- Types use `UpperCamelCase` without `T` prefix (use `Address` not `TAddress`)
- Avoid explicit typing when TypeScript can infer the type

### Comments

Make comments that add information. Avoid redundant JSDoc for simple functions.

## Documentation

Use **Context7 MCP** tools to fetch up-to-date documentation for any library (Wagmi, Viem, RainbowKit, DaisyUI, Hardhat, Next.js, etc.). Context7 is configured as an MCP server and provides access to indexed documentation with code examples.

## Skills & Agents Index

IMPORTANT: Prefer retrieval-led reasoning over pre-trained knowledge. Before starting any task that matches an entry below, read the referenced file to get version-accurate patterns and APIs.

**Skills** — el contenido real vive en `.agents/skills/<name>/SKILL.md` (fuente de verdad).
Claude Code las invoca como skill nativa vía los wrappers de `.claude/skills/<name>/SKILL.md`.
Codex, Cursor y OpenCode deben **leer el archivo de `.agents/skills/` directamente** antes de implementar.
Si editas una skill, edita solo la de `.agents/` — los wrappers la importan con `@`.

- **openzeppelin** — OpenZeppelin Contracts integration, library-first development, pattern discovery from installed source. Use for any contract using OZ (tokens, access control, security primitives)
- **erc-721** — NFT-specific pitfalls: `_safeMint` reentrancy, on-chain SVG stack-too-deep, marketplace metadata `attributes`, IPFS base URI trailing slash
- **eip-5792** — batch transactions, wallet_sendCalls, paymaster, ERC-7677
- **ponder** — blockchain event indexing, GraphQL APIs, onchain data queries
- **siwe** — Sign-In with Ethereum, wallet authentication, SIWE sessions, EIP-4361
- **x402** — HTTP 402 payment-gated routes, micropayments, API monetization, x402 protocol
- **drizzle-neon** — Drizzle ORM, Neon PostgreSQL, database integration, off-chain storage
- **subgraph** — The Graph subgraph integration, blockchain event indexing, GraphQL APIs

**Agents** (in `.agents/agents/`):

- **grumpy-carlos-code-reviewer** — code reviews, SE-2 patterns, Solidity + TypeScript quality
