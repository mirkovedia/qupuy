# El pitch de Qupuy

Para decirlo, no para leerlo. Está escrito como se habla. Tres versiones: la
de tres minutos (la que presentas), la de un minuto (por si te cruzas con un
juez en el pasillo) y la de una frase.

---

## Antes de empezar

- Abre la presentación (`docs/presentacion.pptx` o `docs/presentacion.html`) y
  la app en `qupuy.vercel.app` con tu wallet conectada. Ten `/recibir` abierto
  en otra ventana con la segunda cuenta.
- Un curso ya comprado. Prestar y recuperar probados una vez.
- Respira. El pitch cabe en tres minutos con pausas. Si te apuran, la parte que
  no se corta es **prestar con las dos pantallas**.

---

## Tres minutos — el pitch

> Las marcas entre corchetes son la diapositiva. Las cursivas son lo que haces.

**[1 · Portada]** — 0:00

Hola, soy Mirko, de Cochabamba. Esto es Qupuy. En quechua, *qupuy* es dar a
otro — y también pagar. Una sola palabra para las dos cosas que hace el
producto.

**[2 · El problema]** — 0:15

Empiezo por un dato que no es una exageración: Bolivia es el único país de
Latinoamérica sin PayPal. MercadoPago tampoco opera aquí. Entonces, ¿qué hace
una profesora de inglés en Cochabamba que graba su curso? No puede usar Udemy,
que paga por PayPal. No puede usar Hotmart, que exige una cuenta que reciba
dólares. Hace lo único que puede: vende por WhatsApp, cobra por QR y manda un
enlace de Drive. Tres días después ese enlace está en cinco grupos. Vendió
veinte accesos y lo ven doscientas personas.

El problema no es que le falte blockchain. Es que no tiene forma de cobrar por
un acceso — y de que ese acceso signifique algo.

**[3 · La idea]** — 0:50

Unlock Protocol resuelve el cobro: cada curso tiene un Lock, y comprar es una
transacción. Pero lo importante es lo otro: la membresía de Unlock es un
objeto que el alumno *posee*. Un NFT con fecha de vencimiento. Y un objeto solo
lo tiene una persona a la vez.

Qupuy construye sobre eso. En Bolivia los libros de texto se heredan entre
hermanos. Esto es lo mismo, digital.

**[4 · Cómo funciona]** — 1:10

*Cambias a la app, sin wallet.*

Cualquiera ve la primera clase. Las demás están cerradas — y no cerradas con
CSS: las URLs de pago ni siquiera viajan en la página. Cuando conecto la
wallet, la app le pregunta al contrato: `getHasValidKey`. Ese *true* o *false*
es todo. Lo decide Unlock, no mi aplicación.

*Muestras el curso desbloqueado.*

**[5 · Prestar, regalar, recuperar]** — 1:35

Y aquí está lo que ninguna plataforma permite. Terminé el curso y se lo paso a
mi hermana. Tengo dos formas: regalarlo, que es definitivo, o *prestarlo*.

*Abres "Pasar mi acceso", eliges Prestar, escaneas el QR de la otra pantalla,
firmas.*

Presto. Escaneo su código. Firmo… Yo lo pierdo — y mira su pantalla: le acaba
de llegar, sola. Solo una persona lo tiene a la vez. Y como es un préstamo,
ella no puede pasarlo a nadie, y yo lo recupero cuando quiera. "Como se presta
un libro" no es una metáfora: es una función del contrato, `lendKey`, y casi
nadie la usa.

**[6 · El linaje]** — 2:20

Cada mano es un evento en la blockchain. Qupuy los lee y muestra la historia:
quién lo compró, por quién pasó. Udemy no sabe a quién le prestaste tu cuenta.
Aquí es público y verificable — y quien todavía no compró ve cuánto circula el
curso.

**[8 · Integración] + [9 · Verificado]** — 2:40

Cero Solidity propio: el PublicLock ya lo tiene todo. Tres Locks en Sepolia,
dos compras y una transferencia reales, hecha escaneando un QR. Y un número:
el creador se queda con el 98 %.

**[11 · Cierre]** — 2:55

Qupuy. Dar a otro; pagar. Gracias.

---

## Un minuto — el pasillo

Bolivia es el único país de Latinoamérica sin PayPal: un profesor no tiene
forma de cobrar por internet. Qupuy es un portal de cursos sobre Unlock
Protocol donde el acceso es un objeto que el alumno posee — y cuando termina,
se lo presta a alguien. Solo una persona lo tiene a la vez, quien presta lo
recupera cuando quiere, y cada mano queda registrada en la cadena: Udemy no
sabe a quién le prestaste tu cuenta; aquí es público. Está en Sepolia con tres
Locks, compras y una transferencia reales, y el creador se queda con el 98 %.
Cero Solidity propio: todo es el PublicLock. *Qupuy*, en quechua, es dar a
otro — y pagar.

---

## Una frase

**Cursos donde el acceso es tuyo y, cuando terminas, lo prestas — como un
libro — y la cadena de manos queda en la blockchain.**

---

## Las seis preguntas más probables, en corto

(Las quince completas, con contexto, están en `docs/qupuy-explicado.md`.)

**¿Por qué no `balanceOf`?**
Porque cambió de semántica entre versiones — en v14 solo cuenta keys válidas.
`getHasValidKey` es el contrato explícito de "tiene acceso ahora" y ejecuta
los hooks. Lo verificamos en el código fuente de la versión desplegada.

**¿Y cuando vence?**
El curso vuelve a vista previa y el botón dice "Renovar": `extend` sobre la
misma key. Unlock no deja volver a comprar si ya tienes una.

**¿El gating es real?**
Dos capas: el render no entrega clases de pago sin membresía, y las URLs ni
viajan en la página — las da un endpoint tras consultar el contrato. Ábrelo
con "ver código fuente" y compruébalo.

**¿Es seguro del todo?**
No, y está en el README: el endpoint confía en la dirección sin firma y los
videos son archivos estáticos. Producción es SIWE y URLs firmadas.

**¿Cómo paga un boliviano ETH sin PayPal?**
Con una wallet y un P2P, que sí existen aquí. Qupuy resuelve lo que viene
después del pago: que el acceso signifique algo.

**¿Contratos propios?**
Ninguno, a propósito. El bounty evalúa la integración, no el volumen de
Solidity. El tiempo fue a la experiencia.

---

## Lo que no hay que decir

- **"balanceOf devuelve 1 aunque esté vencida."** Es falso en v14. Usa la
  frase de arriba.
- **"Las URLs nunca llegan al navegador."** Ahora es cierto para las de pago —
  pero di también la limitación: el endpoint confía en la dirección.
- **"Reemplaza a PayPal."** No. Resuelve el cobro por un acceso y lo que ese
  acceso significa. El on-ramp es el siguiente paso.
- **"NFT", "token", "key"** delante de un público general. Di "acceso".
  Delante del jurado técnico, sí: es una key ERC-721 del PublicLock v14.

---

## Ritmo

- Las pausas están en los puntos. Úsalas.
- La diapositiva 5 es la única donde te mueves entre dos pantallas: ensáyala
  tres veces. Si la firma tarda, sigue hablando — "mientras confirma, esto es
  lo que pasa por debajo…" — y vuelve.
- Termina con el linaje en pantalla. Es el plano que se recuerda.
