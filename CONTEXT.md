# CONTEXT.md — Bitácora compartida Claude Code ↔ Codex

> **Este archivo es el canal de comunicación entre las IAs que trabajan en este repo.**
> Claude Code y Codex DEBEN leerlo al iniciar sesión y actualizarlo antes de terminar.
> El código dice *qué* existe; este archivo dice *por qué*, *qué falta* y *quién lo tocó último*.

**Última actualización:** 2026-09-11 — por: Claude Code
**Fase actual:** 🔴 **HACKATHON EN CURSO** — arrancó 2026-09-11, 48h

---

## 1. Qué es este proyecto

**Etherumbo** — hackathon web3 en **Cochabamba, Bolivia**.

| | |
| --- | --- |
| **Evento** | Etherumbo |
| **Lugar** | Cochabamba, Bolivia |
| **Fecha** | **2026-09-11** — empieza hoy |
| **Duración** | **48 horas** — cierre estimado 2026-09-13 |
| **Participación** | Individual — el dev + Claude Code + Codex |
| **Track** | ✅ **Unlock Protocol — Bounty 2** (Portal de Contenido Token-Gated) |
| **Premio** | $250 (1er lugar) / $150 (2do) |
| **Rol de este repo** | Será el **repositorio del proyecto final** |

### Estado del proyecto

**Track elegido:** Unlock Protocol Bounty 2 — Portal de Contenido Token-Gated.
**Decisión estratégica:** foco en UN solo track. No se fuerza compatibilidad con
Avalanche ni Pollar. Avalanche queda como opción de despliegue al final (cero
trabajo extra); Pollar descartado.

**Producto: Qupuy** — portal de cursos donde el acceso es una membresía de
Unlock transferible: "el curso que se puede prestar".

> **Qupuy** (quechua): *dar a otro, entregar* — y también *pagar*. Una sola
> palabra cubre las dos acciones centrales del producto: el usuario **paga**
> para obtener el acceso, y luego **lo da a otro**.
> Verificado libre: sin apps, startups ni productos con ese nombre.

**Diseño aprobado:** `docs/superpowers/specs/2026-09-11-portal-cursos-unlock-design.md`

**Objetivo del dev:** quedar en el podio. El premio es secundario.

### Contratos

| Contrato | Propósito | Estado |
| -------- | --------- | ------ |
| `YourContract.sol` | Ejemplo por defecto de SE-2 | Sin tocar — reemplazar cuando haya proyecto |

### Páginas del frontend

| Ruta | Propósito | Estado |
| ---- | --------- | ------ |
| `/` | Home por defecto de SE-2 | Sin tocar |
| `/debug` | Debug Contracts (autogenerado) | ✅ Funcional — no editar |
| `/blockexplorer` | Explorador local | ✅ Funcional — no editar |

---

## 2. Reglas del evento (Devfolio Code of Conduct)

> Etherumbo se organiza sobre **Devfolio**, así que aplica su Code of Conduct.
> Aquí solo lo que tiene efecto sobre cómo desarrollamos. El resto (no
> discriminación, no acoso, no grabar sin consentimiento, espacio seguro) es
> conducta personal y se cumple por defecto.

### 🔴 Reutilización de código — la regla que más nos afecta

> *"Te animamos a enviar solo proyectos preparados durante la hackathon. Si
> decides enviar proyectos con código reutilizado, o reenviar un proyecto ya
> enviado a otra hackathon, debes declarar ese uso previo y su alcance en el
> submission."*

**Consecuencia si no se declara:** el organizador puede pedirte que señales
similitudes y diferencias con el trabajo anterior, y/o **descalificar el
submission automáticamente**.

**Qué significa para este proyecto:**

| Elemento | Estado | Hay que declararlo |
| -------- | ------ | ------------------ |
| Scaffold-ETH 2 (boilerplate) | Starter kit público, preexistente | ✅ Sí — declarar como base |
| Hooks y componentes de SE-2 (`useScaffold*`, `Address`, `Balance`…) | Vienen con el starter | ✅ Sí — parte de la base |
| `/debug` y `/blockexplorer` | Vienen con el starter | ✅ Sí — parte de la base |
| Skills de `.agents/skills/` | Guías de patrones, preexistentes en el repo | ✅ Sí — mencionarlas |
| OpenZeppelin Contracts | Librería pública estándar | ✅ Sí — dependencia declarada |
| Contratos propios del proyecto | Escritos en estas 48h | ❌ No — es trabajo nuevo |
| Páginas y componentes propios | Escritos en estas 48h | ❌ No — es trabajo nuevo |

**Regla operativa para ambas IAs:** todo lo que se escriba durante la hackathon
debe ser original. No copiar proyectos previos del dev ni código de otras
hackathons. Si se usa un patrón de una skill o de la documentación oficial,
está bien — pero el código resultante debe escribirse aquí, no pegarse de otro
repositorio.

**Redactar la declaración YA** (no en la hora 47): ver plantilla en §10.

### Propiedad intelectual

El dev conserva todos los derechos sobre el proyecto. Devfolio solo obtiene
licencia no exclusiva para exhibirlo en su plataforma. **No hay riesgo en
publicar el repositorio.**

### Otras reglas aplicables

- El Code of Conduct aplica a todos los espacios del evento, presenciales y online.
- Fotografía y video: permitidos, pero respetando la negativa de cualquier persona.
- Ante cualquier incidente, contactar al comité organizador.

---

## 3. Estado actual

### Lo que ya funciona

- Base SE-2 intacta: Hardhat + Next.js App Router + RainbowKit + Wagmi + Viem + DaisyUI.
- 8 skills en `.agents/skills/`, con wrappers en `.claude/skills/` para Claude Code.
- Agente `grumpy-carlos-code-reviewer` disponible en los 4 harnesses.
- Sistema de contexto multi-IA montado: este archivo + protocolo en `AGENTS.md`.

### Lo que está a medias

_(nada en curso)_

### Bloqueos y pendientes

| # | Pendiente | Urgencia |
| - | --------- | -------- |
| 1 | **Tracks sin anunciar** | Bloquea la definición del proyecto. Mientras tanto → ejecutar §8 |
| 2 | **Checklist hora cero sin ejecutar** | 🔴 **AHORA.** Ver §8 — hacerlo antes de que salgan los tracks |
| 3 | **Repo sin `git init`** | 🔴 **Bloqueante** — el plan asume commits desde la Tarea 1 |
| 4 | **Locks sin desplegar** | 🔴 Alta — Tarea 11, única dependencia externa. Arrancar en paralelo |

---

## 4. Plan de las 48 horas

**Inicio:** 2026-09-11 · **Cierre:** 2026-09-13

> Las 48 horas no son 48 horas de código. Descontando descanso, comidas y la
> preparación de la demo, el presupuesto real ronda las **30-32 horas productivas**.
> Planificar sobre 48 es la forma más común de no terminar.

| Fase | Horas | Qué pasa | Regla |
| ---- | ----- | -------- | ----- |
| **0 — Hora cero** | 0-2 | Checklist §8, `git init`, deploy de prueba a testnet | No escribir lógica todavía |
| **1 — Decisión** | 2-4 | Salen los tracks → elegir, definir scope P0/P1/P2 (§5), registrar decisión | **Máximo 2h.** Decidir mal rápido supera a decidir bien tarde |
| **2 — Contratos** | 4-14 | Solidity + tests + deploy a local. Review con `grumpy-carlos` | Contrato desplegado y probado antes de tocar UI |
| **3 — Frontend P0** | 14-26 | El flujo completo end-to-end, aunque sea feo | 🎯 **Al final de esta fase la demo ya debe funcionar** |
| **4 — Testnet** | 26-32 | Deploy a testnet + verificación + frontend desplegado | Si falla, la demo se hace en local — no te bloquees |
| **5 — P1 y pulido** | 32-42 | Funcionalidades que hacen convincente la demo, diseño, estados de carga | Solo si P0 está cerrado |
| **6 — Demo** | 42-48 | Guion, ensayo, README de presentación, video si se pide | 🔴 **Intocable.** No se programa aquí |

### Reglas de corte

- **Hora 26 sin flujo P0 funcionando** → recortar scope de inmediato, no añadir nada.
- **Hora 32** → congelar funcionalidades. Solo se arreglan bugs.
- **Hora 42** → congelar el código por completo. Todo a la demo.

---

## 5. Scope y cortes

> Detalle completo en el spec, §2.

| Prioridad | Funcionalidad | Corte |
| --------- | ------------- | ----- |
| **P0** | Flujo obligatorio: Descubrir → Previsualizar → Verificar → Desbloquear → Contenido completo | Nunca se corta |
| **P1** | Transferencia de acceso (`transferFrom`) + pantalla `/mi-acceso` | Solo si P0 está cerrado |
| **P2** | Checkout de Unlock como alternativa de compra | Se corta primero |

**Regla de hackathon:** la demo tiene que funcionar de principio a fin. Un flujo
completo y modesto gana a uno ambicioso y roto.

**Si algo no llega:** la página `/debug` de SE-2 permite demostrar cualquier
función del Lock sin UI propia. Es la red de seguridad.

---

## 6. Decisiones tomadas

> Toda decisión que no sea evidente leyendo el código.
> **Nunca borrar filas.** Si algo se revierte, marcar `[REVERTIDA]` con el motivo —
> así la otra IA no vuelve a proponer lo mismo.

| Fecha | Decisión | Motivo | Por |
| ----- | -------- | ------ | --- |
| 2026-09-11 | Usar Scaffold-ETH 2 (flavor Hardhat) como base | Trae hooks, componentes web3, burner wallet y debug UI ya resueltos — en hackathon eso es tiempo que no se gasta | Dev |
| 2026-09-11 | Este repo será el proyecto final, no solo práctica | Evita migrar código bajo presión el día del evento | Dev |
| 2026-09-11 | `CONTEXT.md` como bitácora compartida Claude Code ↔ Codex | Ambas IAs trabajan en paralelo; sin estado escrito cada sesión arranca ciega | Claude Code |
| 2026-09-11 | Skills de `.agents/skills/` replicadas como wrappers en `.claude/skills/` | Claude Code no auto-descubre `.agents/`; los wrappers con `@import` mantienen una sola fuente de verdad | Claude Code |
| 2026-09-11 | `AGENTS.md` como fuente de verdad, `CLAUDE.md` solo la importa | Patrón que ya traía el repo; evita duplicar instrucciones | SE-2 (upstream) |
| 2026-09-11 | **Track único: Unlock Bounty 2.** No se fuerzan Avalanche ni Pollar | Un proyecto que cumple tres bounties saca notas medias en tres. El objetivo es podio, no premio — conviene una cosa memorable | Dev + Claude Code |
| 2026-09-11 | **Cero Solidity propio.** Usar el PublicLock de Unlock tal cual | El bounty evalúa integración con Unlock (30%), no volumen de Solidity. Un contrato propio añade bugs, tests y deploy sin sumar puntos | Claude Code |
| 2026-09-11 | Diferenciador: **acceso transferible** ("el curso que se presta") | Usa una propiedad de las Keys que casi nadie usa; imposible en web2; culturalmente boliviano. Apunta a creatividad (25%) | Dev + Claude Code |
| 2026-09-11 | `getHasValidKey`, **nunca** `balanceOf` | `balanceOf` cuenta Keys vencidas. Usarlo rompería el criterio "la validez determina el acceso" — es el error que descalifica | Claude Code |
| 2026-09-11 | Desarrollo en **Base Sepolia**, no en mainnet | Testnet gratuita soportada por Unlock. Unlock no tiene Fuji. Cambiar de red al final es configuración, no código | Claude Code |
| 2026-09-11 | Capa de datos tras interfaz `ContentRepository` | "Stack profesional y escalable": migrar a base de datos es sustituir un módulo, no reescribir la app | Dev + Claude Code |
| 2026-09-11 | Sin tests automatizados de UI; lista de verificación manual | No aportan a la rúbrica en el tiempo disponible. Los escenarios críticos quedan documentados en el spec §12 | Claude Code |
| 2026-09-11 | Nombre del proyecto: **Qupuy** | Quechua para "dar a otro / pagar" — cubre las dos acciones del producto en una palabra. Verificado libre de colisiones (PassOn, PassIt, Handoff, Keyring, Wayki, Muyu estaban todos ocupados) | Dev + Claude Code |

---

## 7. Handoff — mensaje para la siguiente IA

> **Escribe aquí antes de cerrar sesión. Sobrescribe el bloque anterior:**
> esto es un relevo, no un log. Responde: qué hice / qué dejé a medias /
> qué debería hacer el siguiente / qué NO tocar.

**De:** Claude Code → **Para:** la siguiente sesión
**Fecha:** 2026-09-11 — fase 1 cerrada (decisión y diseño)

- **Qué hice:** Cerré la fase de decisión. Track elegido (Unlock Bounty 2),
  producto definido (**Qupuy**), investigación técnica de Unlock verificada
  contra el código fuente (§11), spec completo aprobado y **plan de
  implementación de 19 tareas** escrito.
  - Spec: `docs/superpowers/specs/2026-09-11-portal-cursos-unlock-design.md`
  - Plan: `docs/superpowers/plans/2026-09-11-qupuy.md`
- **Qué dejé a medias:** Nada de código — todavía no se ha escrito ninguna línea.
- **Qué debería hacer el siguiente (en este orden):**
  1. **`git init` + primer commit.** El plan asume commits desde la Tarea 1 y el
     repo aún no está bajo control de versiones.
  2. **Tarea 11 en paralelo** (desplegar los 3 Locks en Base Sepolia). Es la
     única con dependencia externa; conviene arrancarla ya.
  3. Ejecutar el plan desde la Tarea 1.
- **Qué NO tocar:**
  - `packages/nextjs/hooks/scaffold-eth/` y `packages/nextjs/components/scaffold-eth/` — core de SE-2.
  - `packages/nextjs/contracts/deployedContracts.ts` — autogenerado.
  - `.agents/skills/*/SKILL.md` sin actualizar su wrapper en `.claude/skills/`.
- **Recordatorio crítico:** `getHasValidKey`, **nunca** `balanceOf`. Ver spec §6.

---

## 8. Checklist hora cero

> 🔴 **Ejecutar AHORA, en las primeras 2 horas** (fase 0), antes de que salgan
> los tracks. Cada ítem que falle más adelante cuesta entre 20 minutos y una hora
> — y con 48h en marcha, ese tiempo sale directo del proyecto.

- [ ] `yarn install` completa sin errores
- [ ] `yarn chain` levanta la blockchain local
- [ ] `yarn deploy` despliega `YourContract` al chain local
- [ ] `yarn start` sirve el frontend y `/debug` interactúa con el contrato
- [ ] `yarn test` pasa
- [ ] `yarn lint` y `yarn format` pasan
- [ ] Cuenta deployer generada (`yarn generate`) y respaldada de forma segura
- [ ] Red de testnet configurada en `packages/hardhat/hardhat.config.ts` y `packages/nextjs/scaffold.config.ts`
- [ ] Testnet con fondos del faucet
- [ ] Deploy de prueba a testnet funcionando (`yarn deploy --network sepolia`)
- [ ] Verificación de contrato probada (`yarn verify --network sepolia`)
- [ ] Frontend desplegado una vez (`yarn vercel:yolo`) — el primer deploy siempre pide configuración
- [ ] ⏰ Alarmas puestas en las horas 26, 32 y 42 (cortes de §3)
- [ ] `git init`, `.gitignore` revisado, primer commit, remoto configurado
- [ ] Claves de API necesarias en `.env` (Alchemy/Infura, Etherscan) y **fuera de git**

---

## 9. Glosario del proyecto

> Términos de dominio que ambas IAs deben usar con el mismo significado.
> Evita que una IA llame "pool" a lo que la otra llama "vault".

| Término | Significado en este proyecto |
| ------- | ---------------------------- |
| **Etherumbo** | La hackathon web3 de Cochabamba, Bolivia — y el nombre de este repo |
| **Qupuy** | Nombre del producto. Quechua: "dar a otro, entregar" y también "pagar" |
| **Lock** | Contrato de Unlock que define una membresía (precio, duración). Uno por curso |
| **Key** | NFT ERC-721 que representa la membresía de un usuario. Expira y es transferible |
| **Curso** | Unidad de contenido del portal. Tiene módulos y está atado a un Lock |
| **Módulo** | Una clase dentro de un curso. Uno es gratuito (el preview) |
| **Acceso** | Término de UI para la Key. En la interfaz nunca decimos "NFT" ni "Key" |
| **Pasar el acceso** | Transferir la Key a otra wallet (`transferFrom`). El diferenciador |

---

## 10. Declaración de reutilización de código (para el submission)

> 🔴 **Obligatoria por el Code of Conduct de Devfolio** (ver §2). Redactarla
> ahora, no en la hora 47. Copiar y pegar en el campo correspondiente del
> submission en Devfolio.

**Borrador — actualizar al cerrar el proyecto:**

```
DECLARACIÓN DE CÓDIGO PREEXISTENTE

Este proyecto se construyó sobre Scaffold-ETH 2, un starter kit open source
público para dApps en Ethereum (https://github.com/scaffold-eth/scaffold-eth-2),
bajo licencia MIT.

Código PREEXISTENTE (no escrito durante la hackathon):
- Boilerplate de Scaffold-ETH 2: estructura del monorepo, configuración de
  Hardhat y Next.js, hooks de interacción con contratos (useScaffoldReadContract,
  useScaffoldWriteContract, useScaffoldEventHistory y demás), componentes web3
  (Address, AddressInput, Balance, EtherInput), páginas /debug y /blockexplorer,
  burner wallet y faucet local.
- OpenZeppelin Contracts: librería estándar de contratos auditados, licencia MIT.
- Guías de patrones incluidas en el repositorio base (.agents/skills/), usadas
  como referencia de implementación.
- [AÑADIR cualquier otra dependencia o código preexistente]

Código ORIGINAL escrito durante las 48 horas de Etherumbo:
- [LISTAR contratos propios: packages/hardhat/contracts/*.sol]
- [LISTAR scripts de deploy propios: packages/hardhat/deploy/*.ts]
- [LISTAR tests propios: packages/hardhat/test/*.ts]
- [LISTAR páginas y componentes propios: packages/nextjs/app/*, components/*]
- Toda la lógica de negocio, el diseño del sistema y la interfaz de usuario.

No se ha reutilizado código de proyectos previos del autor ni de submissions a
otras hackathons.
```

**Cómo mantenerla:** cada vez que crees un archivo propio, añádelo a la lista de
código original. Al final solo hay que revisar, no redactar desde cero.

---

## 11. Investigación técnica — Unlock Protocol

> Verificado el 2026-09-11 contra el código fuente de
> `unlock-protocol/unlock`, rama `master`, `packages/networks/src/networks/`.
> Fuente autoritativa, no documentación secundaria.

### Redes soportadas por Unlock (13 en total)

`arbitrum · avalanche · base · base-sepolia · bsc · celo · gnosis · linea ·
mainnet · optimism · polygon · scroll · sepolia`

**Detalle de las relevantes:**

| Red | chainId | Testnet | Dirección del contrato Unlock |
| --- | ------- | ------- | ----------------------------- |
| **Avalanche (C-Chain)** | **43114** | ❌ **mainnet** | `0x70cBE5F72dD85aA634d07d2227a421144Af734b3` |
| Base | 8453 | ❌ mainnet | `0xd0b14797b9D08493392865647384974470202A78` |
| Base Sepolia | 84532 | ✅ testnet | `0x259813B665C8f6074391028ef782e27B65840d89` |
| Sepolia | 11155111 | ✅ testnet | `0x36b34e10295cCE69B652eEB5a8046041074515Da` |

### 🔴 Hallazgos decisivos

1. **Unlock SÍ está en Avalanche C-Chain** → el bounty de Unlock y el de
   Avalanche se pueden cumplir con un solo Lock desplegado. Estrategia de
   doble bounty: **viable**.

2. **NO existe soporte para Fuji** (testnet de Avalanche). Las únicas dos
   testnets de Unlock son Sepolia y Base Sepolia. Consecuencia: para cumplir
   el bounty de Avalanche hay que desplegar el Lock en **C-Chain mainnet**,
   con AVAX real. Costo bajo, pero es dinero real.

3. **Estrategia de dos fases recomendada:** desarrollar todo contra
   **Base Sepolia** (testnet gratis) y desplegar el Lock final a
   **Avalanche C-Chain** cuando el flujo esté probado. Cambiar de red es
   configuración, no reescritura.

### Herramientas de Unlock

| Herramienta | Paquete / vía | Para qué |
| ----------- | ------------- | -------- |
| **Paywall** | `@unlock-protocol/paywall` | Modal de checkout embebible. Resuelve la compra de membresía sin construir UI de pago |
| **unlock-js** | `@unlock-protocol/unlock-js` | Wrapper de los ABIs. Abstrae las versiones de Unlock y PublicLock |
| **Checkout Builder** | Web (no-code) | Genera el JSON de configuración del checkout visualmente |
| **Checkout URL** | `/checkout?...` | Alternativa sin librería: enlace directo al flujo de compra |
| **Dashboard** | app.unlock-protocol.com | Despliegue de Locks sin escribir Solidity |

### Verificación de membresía — la clave técnica

El contrato **PublicLock** (el Lock) es un **ERC-721**. Expone:

```solidity
getHasValidKey(address) returns (bool)   // ← la función a usar
balanceOf(address) returns (uint256)     // no distingue keys expiradas
```

> ⚠️ **Usar `getHasValidKey`, no `balanceOf`.** Una key expirada sigue contando
> en `balanceOf` pero ya no da acceso. Confundirlas es el bug clásico de las
> integraciones con Unlock.

**Se puede leer con los hooks de SE-2 sin librerías extra:** el Lock es un
contrato externo → registrarlo en `packages/nextjs/contracts/externalContracts.ts`
y leerlo con `useScaffoldReadContract`, o con `useReadContract` de wagmi.

### Referencias oficiales

| Recurso | URL |
| ------- | --- |
| Template Next.js token-gated | https://github.com/unlock-protocol/unlock-with-next |
| Ejemplos oficiales | https://github.com/unlock-protocol/examples |
| Docs de PublicLock | https://docs.unlock-protocol.com/core-protocol/smart-contracts-api/publiclock/ |
| Docs del Paywall | https://docs.unlock-protocol.com/tools/checkout/paywall/ |
| Hooks de Unlock | https://docs.unlock-protocol.com/core-protocol/public-lock/transfers/#hooks |

> **Nota sobre el template oficial:** `unlock-with-next` usa Pages Router e
> `iron-session`. Este repo usa **App Router**. Sirve como referencia de
> patrones, **no para copiar** — y copiarlo entero tendría que declararse
> como código preexistente (§2).
