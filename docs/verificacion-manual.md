# Verificación manual — Qupuy

Guion para comprobar que el flujo completo funciona antes de grabar la demo y
enviar el proyecto.

**Fecha de ejecución:** 2026-09-12 (en curso)
**Red:** Sepolia (chainId 11155111)
**Ejecutado por:** Mirko + Claude Code

---

## Antes de empezar

- [x] Los 3 Locks están desplegados en Sepolia — verificado contra la cadena
- [x] `packages/nextjs/.env.local` tiene las tres direcciones
- [x] Los tres cobran en **ETH nativo** — verificado con `tokenAddress()`
- [ ] Dos wallets con ETH de Sepolia (la segunda es para probar la transferencia)
- [ ] `yarn start` levanta la aplicación en `http://localhost:3000`

> Si no tienes una segunda wallet, crea una cuenta adicional en MetaMask. Para
> recibir un acceso transferido no necesita fondos.

---

## Fase 1 — Descubrir y previsualizar

Requisitos 1 y 2 del bounty.

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 1 | Abrir `/` **sin wallet conectada** | Se ven los 3 cursos con título, creador, precio en Bs y badge "🔒 Sin acceso" | ✓ |
| 2 | Abrir `/curso/ingles-basico` sin wallet | El primer módulo se reproduce; los demás aparecen con candado y no se pueden seleccionar | ✓ |
| 3 | Intentar pulsar un módulo bloqueado | El botón está deshabilitado; el video no cambia | |
| 4 | Revisar el aviso bajo el botón de compra | Se lee "Tu acceso es tuyo: al terminar, se lo puedes pasar a alguien" | ✓ |
| 5 | Abrir `/mi-acceso` sin wallet | Mensaje claro invitando a conectar la wallet | |

---

## Fase 2 — Verificar y desbloquear

Requisitos 3, 4 y 5 del bounty. **Wallet A.**

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 6 | Conectar la wallet A (sin membresías) | Aparece el botón "🔓 Desbloquear curso completo" con precio en Bs y en ETH | ✓ |
| 7 | Volver a `/` con la wallet conectada | Las tarjetas muestran brevemente un skeleton y luego "Sin acceso" — **nunca un estado incorrecto** | |
| 8 | Pulsar "Desbloquear" y **rechazar** la firma en la wallet | Mensaje de cancelación; la UI queda consistente y el botón vuelve a estar disponible | |
| 9 | Pulsar "Desbloquear" y **confirmar** | La wallet pide firma; tras confirmarse aparece "¡Listo! Ya tienes acceso al curso" | ✓ |
| 10 | Observar la pantalla tras la compra | **El contenido completo aparece sin recargar la página** | ✓ |
| 11 | Revisar el indicador de estado | "✓ Acceso activo · vence en 29 días" (o 30) | ✓ |
| 12 | Reproducir un módulo de pago | El video carga y se reproduce | ✓ |
| 13 | Recargar la página con F5 | Sigue mostrando el contenido completo | ✓ |
| 14 | Volver a `/` | La tarjeta de ese curso muestra "Acceso activo" | |
| 15 | Abrir `/mi-acceso` | Aparece solo el curso comprado, con botón "Ver curso" y "Pasar mi acceso a alguien" | |

> **El escenario 10 es el más importante de la demo.** Es donde se ve que Unlock
> decide el acceso: el contenido aparece porque el contrato dice que la
> membresía es válida, no porque la aplicación lo asuma.

---

## Fase 3 — Transferir el acceso

El diferenciador del proyecto. **Wallet A → Wallet B.**

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 16 | Con la wallet A, pulsar "Pasar mi acceso a alguien" | Se abre el modal con la advertencia "Tú perderás el acceso. Solo una persona puede tenerlo a la vez." | ✓ |
| 17 | Dejar el campo vacío | El botón "Pasar acceso" está deshabilitado | ✓ código |
| 18 | Escribir una dirección inválida (`0x123`) | Mensaje "Esa dirección no es válida" | ✓ código |
| 19 | Escribir **tu propia** dirección | Mensaje "No puedes pasarte el acceso a ti mismo" | ✓ código |
| 20 | Pulsar "Cancelar" | El modal se cierra sin efectos secundarios | |
| 21 | Escribir la dirección de la wallet B y confirmar | La wallet pide firma; tras confirmarse, "Acceso pasado correctamente" | ✓ escaneando el QR |
| 22 | Observar la pantalla de la wallet A | **Pierde el acceso sin recargar**: vuelve al estado de vista previa | ✓ |
| 23 | Seleccionar un módulo de pago antes de transferir, y transferir | Tras la transferencia el reproductor vuelve al módulo gratuito automáticamente | |
| 24 | Abrir `/mi-acceso` con la wallet A | El curso transferido ya no aparece como activo | |
| 25 | Conectar la **wallet B** y abrir el curso | Tiene acceso completo, con sus días restantes | ✓ verificado en cadena |

> **El escenario 23** comprueba que el gating no se rompe en la transición: el
> estado local recuerda el módulo 3, pero la vista debe volver al gratuito
> porque el acceso ya no existe.

---

## Fase 4 — Casos límite

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 26 | Cambiar la wallet a una red distinta | Aviso claro con botón que cambia a Sepolia — **probado: el cambio funciona** | ✓ |
| 27 | Desconectar la wallet estando en un curso desbloqueado | La vista vuelve al estado de vista previa | |
| 28 | Intentar comprar con una wallet sin fondos | Mensaje de error legible; la aplicación no se rompe | |
| 29 | Comprar un curso que ya tienes | El botón no aparece: ya tienes acceso | ✓ código |
| 30 | Navegar a un curso inexistente (`/curso/no-existe`) | Página 404, no un error de la aplicación | ✓ código |

---

## Fase 5 — Antes de enviar

| # | Comprobación | ✓/✗ |
| - | ------------ | --- |
| 31 | `yarn test` pasa (22/22) | ✓ |
| 32 | `yarn next:build` termina sin errores | ✓ |
| 33 | `yarn lint` sin errores en código propio | ✓ |
| 34 | El despliegue en Vercel reproduce los escenarios 1, 2, 9 y 21 | parcial: rutas y contenido verificados; falta probar compra en producción |
| 35 | El README tiene las direcciones reales de los Locks | ✓ |
| 36 | La declaración de código preexistente está completa | |
| 37 | El video dura 3 minutos o menos | |

---

## Fase 6 — Añadido tras la auditoría del 13 de septiembre

Préstamos, recepción en vivo, red no configurada y los estados que antes
fallaban. **Wallet A** tiene el acceso; **wallet B** lo recibe.

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 38 | En el modal, elegir **Prestar** y confirmar a la wallet B | Firma; "Acceso prestado. Puedes recuperarlo cuando quieras". La wallet A pierde el acceso sin recargar | simulado desde A |
| 39 | Con la wallet B abrir el curso | Tiene acceso; el lateral dice "Es un préstamo · Te lo prestó 0x567…" y **no** aparece "Pasar mi acceso" | |
| 40 | Con la wallet A abrir `/mi-acceso` | La tarjeta muestra "Prestado" con la dirección de B y el botón "Recuperar" | |
| 41 | Pulsar "Recuperar" y confirmar | "Tu acceso volvió contigo"; A recupera el acceso y B lo pierde, sin recargar | |
| 42 | Abrir `/recibir` con la wallet B en una ventana y pasarle un acceso desde A | La pantalla de B anuncia sola "¡Recibiste …!" en menos de cinco segundos | |
| 43 | Tras pasar el acceso, mirar el badge de A **sin recargar** | "Sin acceso" — nunca "Tu acceso venció" | ✓ código |
| 44 | Tras pasar el acceso, mirar la historia **sin recargar** | Aparece el nuevo paso y el titular cambia a "Ya circuló…" | ✓ código |
| 45 | Poner la wallet en una red **no configurada** (Polygon, Base, Arbitrum) y abrir un curso | El botón de compra se sustituye por "Estás en otra red" con el cambio; nunca llega a pedir firma | ✓ código |
| 46 | Abrir el modal de pasar acceso con la wallet en otra red | El botón de confirmar está deshabilitado y el aviso de red aparece dentro del modal | ✓ código |
| 47 | Sin conexión al RPC (o con la clave compartida throttleada) abrir un curso | La historia muestra "No se pudo leer la historia" con "Reintentar"; no desaparece | ✓ código |
| 48 | Conectar la wallet | El modal de RainbowKit es oscuro, con el acento rojo del tema | ✓ código |
| 49 | Abrir en un teléfono | La cabecera muestra la marca "qupuy" | ✓ código |
| 50 | Abrir `/ruta-inexistente` | Página 404 en español con enlace al catálogo | ✓ código |
| 51 | En `/debug`, comparar `totalKeys`, `balanceOf` y `getHasValidKey` para 0x567… en LockIngles | `1`, `1`, `true` — y el texto explica que el acceso lo decide la tercera | ✓ en cadena |
| 52 | Ver el código fuente de `/curso/ingles-basico` **sin wallet** y buscar `ingles-02.mp4` | No aparece: solo `ingles-01.mp4`, la clase gratuita | |
| 53 | `GET /api/clase/1-2?address=<wallet sin membresía>` | `403` con `code: "NO_ACCESS"`; con una wallet con membresía, `{ videoUrl }` | |
| 54 | Con acceso, cambiar de clase | El reproductor muestra un instante de carga y luego la clase; si el servidor falla, "No se pudo obtener esta clase" con "Reintentar" | |

---

## Cómo registrar los resultados

Marca ✓ o ✗ en cada fila. Las marcadas **✓ código** se verificaron leyendo la
implementación, no ejecutándolas en el navegador: conviene confirmarlas en vivo
si hay tiempo, pero la lógica está comprobada.

Marca ✓ o ✗ en cada fila. **Cualquier ✗ en las fases 1 a 3 hay que
corregirlo antes de enviar**: son los requisitos que el bounty evalúa.

Los fallos en la fase 4 se valoran caso por caso — describe qué pasó en la
sección de abajo.

### Incidencias encontradas

**Videos sin audio.** Los clips de demostración son material de stock, que se
distribuye sin pista de sonido. No es un fallo: la narración va encima en el
video de presentación.

**Transferencia ejecutada y verificada.** El acceso a "Reparación de celulares"
pasó de `0x567FCdC…413aC` a `0xa6fc1c38…02e39` en el bloque 11694004, usando el
escaneo de QR. Tras ella `getHasValidKey` devuelve `false` para el emisor y
`true` para el receptor. El linaje muestra "Ya pasó por una mano".

**Incidencia resuelta: gas límite.** Un segundo intento de compra sobre un
curso ya adquirido provocaba que la wallet estimara 21.000.000 de gas, por
encima del tope de algunos RPC. Se corrigió simulando las transacciones antes
de pedir la firma y fijando un techo de gas explícito.

**Auditoría del 13 de septiembre (resuelto).** Cuatro cosas que no se veían
en la lista anterior: (1) la afirmación "balanceOf cuenta keys vencidas" era
falsa para PublicLock v14 —solo cuenta válidas; `totalKeys` cuenta todas— y el
estado "vencido" era inalcanzable; (2) tras pasar el acceso, el emisor veía
"Tu acceso venció" y la historia no se actualizaba hasta recargar, porque React
Query conserva el dato de una consulta desactivada; (3) con la wallet en una
red no configurada, la compra se firmaba en esa red con éxito falso; (4) el
RPC público rechaza `eth_getLogs` y la historia dependía en silencio de la
clave Alchemy compartida de Scaffold-ETH. Detalle en `CONTEXT.md` §6.

---

## Datos para el submission

Completar durante la verificación:

| Dato | Valor |
| ---- | ----- |
| Lock de Inglés | `0x761963f20958660130181fa785ddd6efc64fa862` |
| Lock de Excel | `0x911f1a42bdf3a896aa170a3ab3adde1e015e1eae` |
| Lock de Reparación de celulares | `0xa00fa3e21a65a77ba17953d88f926b650160313c` |
| Hash de una compra de ejemplo | _(anotar durante la verificación)_ |
| Hash de una transferencia de ejemplo | _(anotar durante la verificación)_ |
| URL pública (Vercel) | https://qupuy.vercel.app |
