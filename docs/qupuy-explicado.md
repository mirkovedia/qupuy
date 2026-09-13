# Qupuy, explicado

Para entender la aplicación de punta a punta y poder defenderla en voz alta.
Todo lo que dice este documento está en el código o verificado en la cadena.

---

## 1. En una frase

**Qupuy es un portal de cursos donde el acceso es un objeto que el alumno
posee y puede pasarle a otra persona — prestado o regalado — y cada mano por
la que pasa queda registrada en la blockchain.**

*Qupuy* (quechua): dar a otro, entregar — y también pagar. Las dos cosas que
hace el producto en una sola palabra.

---

## 2. El problema real

En Bolivia un creador de contenido no tiene forma de cobrar por internet. No
es una exageración:

- **Bolivia es el único país de Latinoamérica sin PayPal.**
- **MercadoPago** opera en toda la región salvo Ecuador, Bolivia y Venezuela.
- Udemy paga por PayPal. Hotmart exige una cuenta que reciba dólares.
  Teachable usa Stripe, que no opera aquí.

La salida real de un profesor de inglés en Cochabamba es vender por WhatsApp,
cobrar por QR y mandar un enlace de Drive. Tres días después el enlace circula
en cinco grupos: **vendió veinte accesos y lo ven doscientas personas.**

El problema no es que falte blockchain. Es que no tiene forma de cobrar por un
acceso, y de que ese acceso signifique algo.

---

## 3. Qué es Qupuy

**Para el alumno:** un catálogo de cursos. Ve gratis la primera clase de
cualquiera. Compra el acceso con su wallet, ve el curso completo durante 30
días, y cuando termina se lo pasa a alguien.

**Para el creador:** una forma de cobrar que no depende de PayPal ni de un
banco que reciba dólares, y un acceso que significa algo: solo una persona lo
tiene a la vez, aunque circule.

**Por dentro:** cada curso tiene un **Lock** de Unlock Protocol (un contrato
desplegado desde su panel, sin escribir Solidity). Comprar es llamar a ese
contrato; el alumno recibe una **key**, un NFT con fecha de vencimiento. La
aplicación no decide nada por su cuenta: le pregunta al contrato.

---

## 4. Cómo se usa, paso a paso

| Paso | Qué hace la persona | Qué pasa por debajo |
| ---- | ------------------- | ------------------- |
| Descubrir | Abre `qupuy.vercel.app`, ve tres cursos con precio en Bs y duración | La portada lee la actividad de cada Lock |
| Previsualizar | Entra a un curso sin wallet y ve la primera clase | Solo la clase gratuita viaja en la página |
| Verificar | Conecta la wallet | La app llama a `getHasValidKey(wallet)` en el Lock del curso |
| Desbloquear | Pulsa "Desbloquear curso completo" y firma | `purchase()` en el Lock, con el precio que el propio contrato indica |
| Ver | El contenido aparece sin recargar | El servidor entrega cada clase de pago solo tras consultar el contrato |
| Pasar | Pulsa "Pasar mi acceso", elige Prestar o Regalar, escanea el QR de la otra persona | `lendKey()` o `transferFrom()` |
| Recuperar | En "Mi acceso", pulsa "Recuperar" sobre un préstamo | `unlendKey()` |
| Renovar | Cuando venció, "Renovar mi acceso" | `extend()` sobre la misma key |

**Rutas:** `/` catálogo · `/curso/[slug]` el curso · `/mi-acceso` tus accesos y
tus préstamos · `/recibir` tu QR para recibir · `/debug` para consultar los
contratos a mano.

---

## 5. Las tres formas de mover un acceso

Esto es lo que ninguna plataforma de cursos puede ofrecer, y es la razón de
ser del proyecto.

| | Qué pasa | Quién manda después | Función del contrato |
| - | -------- | ------------------- | -------------------- |
| **Regalar** | El acceso pasa a ser de la otra persona, definitivamente. Puede volver a pasarlo. | Quien lo recibió | `transferFrom` |
| **Prestar** | La otra persona tiene el acceso, pero **no puede pasarlo a nadie**. Tú sigues siendo el *key manager*. | Quien lo prestó | `lendKey` |
| **Recuperar** | Un préstamo vuelve a quien lo prestó, cuando quiera. | — | `unlendKey` |

En los tres casos, **quien entrega pierde el acceso en el acto**. Solo una
persona lo tiene a la vez. No hay "compartir contraseña": hay un objeto que
cambia de manos.

**Qué ve cada persona:**

- Quien recibe un **préstamo** ve el curso completo, un aviso "Es un préstamo ·
  Te lo prestó 0x…", y no tiene el botón de pasar el acceso.
- Quien **prestó** ve en "Mi acceso" la tarjeta del curso marcada "Prestado",
  con la dirección de la otra persona y el botón "Recuperar".
- Quien **recibe** en `/recibir` no tiene que hacer nada: su pantalla consulta
  el contrato cada tres segundos y anuncia sola "¡Recibiste X!" cuando llega.

---

## 6. Cómo funciona por dentro

### Unlock Protocol

- **Lock:** el contrato de una membresía. Define precio, duración y moneda.
  Uno por curso. Es un `PublicLock` **versión 14**, desplegado desde el panel
  de Unlock. Qupuy no escribe Solidity: el bounty evalúa la integración, no el
  volumen de contrato propio.
- **Key:** el NFT (ERC-721) que representa la membresía de una wallet. Tiene
  fecha de vencimiento y se puede transferir.
- **Red:** Sepolia (testnet). Cambiar de red es añadir una entrada al registro
  de Locks, no reescribir la aplicación.

### Qué decide el acceso

`getHasValidKey(wallet)`. Es la única función cuyo significado es exactamente
"esta wallet tiene acceso ahora": comprueba la expiración y ejecuta los hooks
de validez del Lock.

**No** se usa `balanceOf` para decidir el acceso. Su semántica ha cambiado
entre versiones del PublicLock: en la v14 desplegada aquí solo cuenta keys
válidas (recorre las keys de la wallet y llama a `isValidKey`); en versiones
anteriores contaba todas. Apoyar el acceso en ella acoplaría la aplicación a la
versión del contrato. Para saber si una wallet posee alguna key —vigente o
vencida— y llegar a su `tokenId`, se usa `totalKeys`, que cuenta todas.

### Dónde está el gating

1. **En el render.** `moduloReproducible = tieneAcceso ? moduloActivo :
   moduloGratuito`. Sin membresía válida, ningún reproductor recibe una clase
   de pago y la lista no permite seleccionarlas. Se recalcula en cada render:
   si pasas tu acceso con el módulo 3 abierto, la vista vuelve al gratuito al
   instante.
2. **En el servidor.** Las URLs de las clases de pago **no viajan en la
   página**. El servidor las quita antes de enviar el curso al navegador, y
   `/api/clase/[id]` las entrega solo después de consultar `getHasValidKey` en
   el Lock. Abrir el código fuente de un curso sin membresía no revela ninguna
   clase de pago — se puede comprobar con "ver código fuente".

### El linaje

Cada compra y cada transferencia emite un evento `Transfer` en el Lock. Qupuy
los lee y reconstruye la historia: el primero de cada key sale de la dirección
cero (la compra); los siguientes son manos reales. Quien todavía no compró ve
la actividad del curso ("3 accesos vendidos · ya circuló una vez"); quien lo
tiene ve el recorrido de su propio acceso.

### Las funciones del Lock que usa Qupuy

| Función | Para qué |
| ------- | -------- |
| `getHasValidKey` | Decidir el acceso, en el cliente y en el servidor |
| `totalKeys`, `tokenOfOwnerByIndex` | Llegar al tokenId de la key, vigente o vencida |
| `keyExpirationTimestampFor` | Días restantes |
| `keyManagerOf` | Saber si un acceso es un préstamo |
| `purchasePriceFor`, `keyPrice` | El precio |
| `expirationDuration`, `tokenAddress` | Duración y moneda del Lock |
| `purchase` | Comprar |
| `extend` | Renovar una key vencida |
| `transferFrom` | Regalar |
| `lendKey`, `unlendKey` | Prestar y recuperar |
| `totalSupply`, evento `Transfer` | Accesos vendidos y linaje |

### Seguridad de las transacciones

Cada escritura se **simula** antes de pedir la firma: si el contrato la va a
rechazar, la persona lo sabe sin gastar gas. Se fija un techo de gas explícito.
Se comprueba el recibo de la transacción antes de dar nada por hecho. Y el
`chainId` del Lock viaja en cada transacción: si la wallet está en otra red,
wagmi rechaza la firma en lugar de enviarla donde esté, y la interfaz ofrece el
cambio de red.

---

## 7. Lo que está verificado

| Qué | Dónde |
| --- | ----- |
| Tres Locks desplegados, v14, ETH nativo, 30 días, transferibles | Sepolia; direcciones en el README |
| Compra de "Inglés desde cero" | bloque 11 691 183 |
| Compra de "Reparación de celulares" | bloque 11 693 688 |
| **Transferencia del acceso**, escaneando un QR | bloque 11 694 004 |
| Tras la transferencia, `getHasValidKey` = `false` para quien pasó y `true` para quien recibió | `/debug` |
| `lendKey`, `transferFrom`, `extend` simulados desde la wallet del dev contra el Lock real | sin firmar, pasan |
| La página de un curso sin wallet no contiene ninguna URL de pago | `curl` en producción: 0 |
| `/api/clase/1-2` responde 200 con membresía, 403 sin ella | producción |
| 23 tests de lógica, lint, tipos y build en verde | repo |

**Un número para decir en voz alta:** cada Lock retiene el **98 %** de cada
venta; la comisión de protocolo de Unlock es del 2 %. Hotmart cobra hasta un
9,9 % más tarifa fija; Udemy, hasta un 63 % en ventas orgánicas.

---

## 8. Lo que no hace todavía (y se dice)

- **El endpoint de clases confía en la dirección que se le indica.** No pide
  una firma. Alguien que conozca la dirección de un alumno con membresía podría
  pedir las URLs en su nombre. La ruta de producción es autenticar la wallet
  por firma (SIWE) y responder con URLs firmadas de expiración corta.
- **Los videos son archivos estáticos.** Quien conozca una ruta puede
  descargarla. Misma solución: URLs firmadas.
- **No hay panel del creador.** El Lock ya guarda el dinero; falta la pantalla
  con ventas, circulación y retiro (`withdraw`).
- **Es testnet.** Sepolia, con ETH de prueba. El precio en Bs es de
  referencia; el cobro real lo hace el Lock en la moneda y al precio que tenga.

Se dicen en el README porque un jurado técnico lo notaría, y ocultarlo sería
peor que reconocerlo.

---

## 9. Cómo demostrarlo en tres minutos

**Antes:** dos ventanas — la app con tu wallet, y `/recibir` con la otra
cuenta. Ten un curso ya comprado para no esperar en vivo. Prueba una vez
prestar y recuperar.

| Tiempo | Pantalla | Qué decir |
| ------ | -------- | --------- |
| 0:00 | Portada | "Bolivia es el único país de Latinoamérica sin PayPal. Un profesor boliviano no tiene forma de cobrar por internet." |
| 0:25 | Logo | "Qupuy: en quechua, dar a otro — y pagar." |
| 0:45 | Curso sin wallet | "Cualquiera ve la primera clase. Las demás ni siquiera viajan en la página: el servidor las entrega solo cuando el contrato dice que tienes acceso." |
| 1:10 | Comprar | "Compro… y el contenido aparece solo. El creador se queda con el 98 %." |
| 1:45 | Prestar, con las dos pantallas | "Se lo presto. Escaneo su código… yo lo pierdo, ella lo gana — mira su pantalla. Y como es un préstamo, ella no puede pasarlo y yo lo recupero cuando quiera." |
| 2:30 | Linaje | "La cadena queda registrada. Udemy no sabe a quién le prestaste tu cuenta. Aquí es público y verificable." |

---

## 10. Preguntas que te pueden hacer — y cómo responder

**¿Por qué blockchain y no un login normal?**
Porque el problema no es el login: es el cobro y la propiedad. Un login no
resuelve que no haya PayPal, y una cuenta no se puede prestar sin entregarla
entera. La key de Unlock resuelve las dos cosas: es un pago y es un objeto.

**¿Y balanceOf? ¿No sirve para saber si alguien tiene la membresía?**
No para decidir el acceso. Su semántica cambió entre versiones del PublicLock:
en la v14 solo cuenta keys válidas; antes contaba todas. `getHasValidKey` es
el contrato explícito de "tiene acceso ahora", ejecuta los hooks de validez, y
no depende de la versión. Lo verificamos en el código fuente de la versión
desplegada.

**¿Qué pasa cuando vence?**
`getHasValidKey` devuelve `false`, el curso vuelve a la vista previa y el botón
pasa a ser "Renovar mi acceso", que llama a `extend` sobre la misma key. No se
puede volver a comprar: Unlock rechaza un `purchase` cuando ya posees una key,
aunque esté vencida.

**¿Se puede transferir una key vencida?**
No. El contrato lo impide (`_isValidKey` en `transferFrom`). Hay que renovar
antes.

**¿Y si me prestan el acceso y yo lo quiero pasar?**
No puedes. En un préstamo el key manager es quien prestó; la interfaz ni
siquiera te muestra el botón, y el contrato rechazaría la operación.

**¿Cómo sabes que el gating es real y no CSS?**
Dos capas. En el render: sin membresía válida, ningún reproductor recibe una
clase de pago. En el servidor: las URLs de pago no viajan en la página; las
entrega `/api/clase/[id]` tras consultar el contrato. Abre "ver código fuente"
de un curso sin wallet: no encontrarás ninguna clase de pago.

**Entonces, ¿es seguro del todo?**
No, y está escrito en el README. El endpoint confía en la dirección que se le
indica y los archivos son estáticos. La ruta de producción es SIWE y URLs
firmadas. Preferimos declararlo a ocultarlo.

**¿Por qué Sepolia y no mainnet?**
Porque es una demo de 48 horas y el gas de prueba es gratis. Cambiar de red es
añadir una entrada al registro de Locks. Unlock ya opera en Base y en Avalanche
C-Chain.

**¿Cómo paga un boliviano ETH si no tiene PayPal?**
Hoy, con una wallet y un exchange P2P — que sí existen en Bolivia. El siguiente
paso natural es un on-ramp local por QR. Lo que Qupuy resuelve es lo que viene
después del pago: que el acceso signifique algo.

**¿Cuánto se queda el creador?**
El 98 %. La comisión de protocolo de Unlock es del 2 %. Hotmart cobra hasta
9,9 % más tarifa fija; Udemy hasta 63 % en ventas orgánicas.

**¿Escribieron contratos propios?**
No, a propósito. El bounty evalúa la integración con Unlock, no el volumen de
Solidity. Un contrato propio habría añadido bugs, tests y despliegue sin sumar
puntos. El tiempo fue a la experiencia.

**¿Por qué el precio dice Bs 70 si el Lock cobra 0,0001 ETH?**
Bs 70 es el precio de referencia que el creador cobraría; en la demo el Lock
cobra ETH de prueba, y la tarjeta lo dice. En producción el precio del Lock se
configura al equivalente.

**¿Qué pasa si el RPC falla?**
La historia del acceso muestra "No se pudo leer la historia" con un botón de
reintento, y el número de accesos vendidos sale directamente del contrato
(`totalSupply`). Nada desaparece en silencio.

**¿Y si mi wallet está en otra red?**
La app sigue mostrando tu estado (las lecturas van siempre a la red del Lock),
pero para comprar o pasar el acceso te ofrece cambiar de red. Nunca firma en
una red equivocada: el `chainId` va en cada transacción.

**¿Esto ya existe en otro sitio?**
Membresías con Unlock, sí. Un portal de cursos donde el acceso se presta con
`lendKey`, se recupera, y la cadena de manos se muestra como parte del
producto, no lo hemos visto. Y el contexto boliviano —sin PayPal— es lo que le
da sentido.

---

## 11. Glosario

| Término | Qué es |
| ------- | ------ |
| **Lock** | El contrato de Unlock de un curso: precio, duración, moneda |
| **Key** | El NFT que representa la membresía de una wallet. Vence y se transfiere |
| **Acceso** | Cómo la interfaz llama a la key. Nunca decimos "NFT" ni "key" al usuario |
| **Pasar el acceso** | Prestar o regalar la key a otra wallet |
| **Préstamo** | Pasar la key conservando el control (`lendKey`); se recupera con `unlendKey` |
| **Key manager** | Quien controla una key. Por defecto, su dueño; tras un préstamo, quien prestó |
| **Linaje** | La historia de manos por las que pasó un acceso, leída de los eventos `Transfer` |
| **Gating** | Decidir qué contenido se entrega según la membresía |
| **Sepolia** | La red de prueba de Ethereum donde viven los Locks |

---

## 12. Cifras para decir en voz alta

- Bolivia: **único país de Latinoamérica sin PayPal**.
- **98 %** para el creador; 2 % de protocolo.
- **3** Locks, **2** compras y **1** transferencia verificadas en cadena.
- **0** URLs de pago en la página de un curso sin wallet.
- **1** persona con el acceso a la vez. Siempre.
