# Verificación manual — Qupuy

Guion para comprobar que el flujo completo funciona antes de grabar la demo y
enviar el proyecto.

**Fecha de ejecución:** ______
**Red:** Sepolia (chainId 11155111)
**Ejecutado por:** ______

---

## Antes de empezar

- [ ] Los 3 Locks están desplegados en Sepolia
- [ ] `packages/nextjs/.env.local` tiene las tres direcciones
- [ ] **Las transferencias están habilitadas** en la configuración de cada Lock
- [ ] Dos wallets con ETH de Sepolia (la segunda es para probar la transferencia)
- [ ] `yarn start` levanta la aplicación en `http://localhost:3000`

> Si no tienes una segunda wallet, crea una cuenta adicional en MetaMask. Para
> recibir un acceso transferido no necesita fondos.

---

## Fase 1 — Descubrir y previsualizar

Requisitos 1 y 2 del bounty.

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 1 | Abrir `/` **sin wallet conectada** | Se ven los 3 cursos con título, creador, precio en Bs y badge "🔒 Sin acceso" | |
| 2 | Abrir `/curso/ingles-basico` sin wallet | El primer módulo se reproduce; los demás aparecen con candado y no se pueden seleccionar | |
| 3 | Intentar pulsar un módulo bloqueado | El botón está deshabilitado; el video no cambia | |
| 4 | Revisar el aviso bajo el botón de compra | Se lee "Tu acceso es tuyo: al terminar, se lo puedes pasar a alguien" | |
| 5 | Abrir `/mi-acceso` sin wallet | Mensaje claro invitando a conectar la wallet | |

---

## Fase 2 — Verificar y desbloquear

Requisitos 3, 4 y 5 del bounty. **Wallet A.**

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 6 | Conectar la wallet A (sin membresías) | Aparece el botón "🔓 Desbloquear curso completo" con precio en Bs y en ETH | |
| 7 | Volver a `/` con la wallet conectada | Las tarjetas muestran brevemente un skeleton y luego "Sin acceso" — **nunca un estado incorrecto** | |
| 8 | Pulsar "Desbloquear" y **rechazar** la firma en la wallet | Mensaje de cancelación; la UI queda consistente y el botón vuelve a estar disponible | |
| 9 | Pulsar "Desbloquear" y **confirmar** | La wallet pide firma; tras confirmarse aparece "¡Listo! Ya tienes acceso al curso" | |
| 10 | Observar la pantalla tras la compra | **El contenido completo aparece sin recargar la página** | |
| 11 | Revisar el indicador de estado | "✓ Acceso activo · vence en 29 días" (o 30) | |
| 12 | Reproducir un módulo de pago | El video carga y se reproduce | |
| 13 | Recargar la página con F5 | Sigue mostrando el contenido completo | |
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
| 16 | Con la wallet A, pulsar "Pasar mi acceso a alguien" | Se abre el modal con la advertencia "Tú perderás el acceso. Solo una persona puede tenerlo a la vez." | |
| 17 | Dejar el campo vacío | El botón "Pasar acceso" está deshabilitado | |
| 18 | Escribir una dirección inválida (`0x123`) | Mensaje "Esa dirección no es válida" | |
| 19 | Escribir **tu propia** dirección | Mensaje "No puedes pasarte el acceso a ti mismo" | |
| 20 | Pulsar "Cancelar" | El modal se cierra sin efectos secundarios | |
| 21 | Escribir la dirección de la wallet B y confirmar | La wallet pide firma; tras confirmarse, "Acceso pasado correctamente" | |
| 22 | Observar la pantalla de la wallet A | **Pierde el acceso sin recargar**: vuelve al estado de vista previa | |
| 23 | Seleccionar un módulo de pago antes de transferir, y transferir | Tras la transferencia el reproductor vuelve al módulo gratuito automáticamente | |
| 24 | Abrir `/mi-acceso` con la wallet A | El curso transferido ya no aparece como activo | |
| 25 | Conectar la **wallet B** y abrir el curso | Tiene acceso completo, con sus días restantes | |

> **El escenario 23** comprueba que el gating no se rompe en la transición: el
> estado local recuerda el módulo 3, pero la vista debe volver al gratuito
> porque el acceso ya no existe.

---

## Fase 4 — Casos límite

| # | Escenario | Resultado esperado | ✓/✗ |
| - | --------- | ------------------ | --- |
| 26 | Cambiar la wallet a una red distinta (Ethereum mainnet) | Aviso claro de red incorrecta, con opción de volver a Sepolia | |
| 27 | Desconectar la wallet estando en un curso desbloqueado | La vista vuelve al estado de vista previa | |
| 28 | Intentar comprar con una wallet sin fondos | Mensaje de error legible; la aplicación no se rompe | |
| 29 | Comprar un curso que ya tienes | El botón no aparece: ya tienes acceso | |
| 30 | Navegar a un curso inexistente (`/curso/no-existe`) | Página 404, no un error de la aplicación | |

---

## Fase 5 — Antes de enviar

| # | Comprobación | ✓/✗ |
| - | ------------ | --- |
| 31 | `yarn test` pasa (15/15) | |
| 32 | `yarn next:build` termina sin errores | |
| 33 | `yarn lint` sin errores en código propio | |
| 34 | El despliegue en Vercel reproduce los escenarios 1, 2, 9 y 21 | |
| 35 | El README tiene las direcciones reales de los Locks | |
| 36 | La declaración de código preexistente está completa | |
| 37 | El video dura 3 minutos o menos | |

---

## Cómo registrar los resultados

Marca ✓ o ✗ en cada fila. **Cualquier ✗ en las fases 1 a 3 hay que
corregirlo antes de enviar**: son los requisitos que el bounty evalúa.

Los fallos en la fase 4 se valoran caso por caso — describe qué pasó en la
sección de abajo.

### Incidencias encontradas

_(anotar aquí: número del escenario, qué ocurrió y qué se esperaba)_

---

## Datos para el submission

Completar durante la verificación:

| Dato | Valor |
| ---- | ----- |
| Lock de Inglés | |
| Lock de Excel | |
| Lock de Reparación de celulares | |
| Hash de una compra de ejemplo | |
| Hash de una transferencia de ejemplo | |
| URL pública (Vercel) | |
