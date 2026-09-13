# Entrega — Unlock Protocol Bounty 2

Todo lo que pide el submission, listo para copiar.

---

## Datos del proyecto

**Nombre:** Qupuy

**Descripción breve:**

> Portal de cursos donde el acceso es una membresía de Unlock que el alumno
> posee y puede pasarle a otra persona, como se presta un libro.
>
> En Bolivia —el único país de Latinoamérica sin PayPal, y donde MercadoPago no
> opera— un creador no tiene forma de cobrar por internet. Qupuy le da esa capa
> de cobro y acceso, y añade algo que ninguna plataforma puede ofrecer: cuando
> el alumno termina, le pasa el acceso a alguien. Solo una persona lo tiene a
> la vez, y la cadena completa de manos por las que pasó queda registrada en la
> blockchain.

**Repositorio:** https://github.com/mirkovedia/qupuy

**URL pública:** https://qupuy.vercel.app

**Red:** Sepolia (chainId 11155111)

---

## Locks desplegados

| Curso | Precio | Dirección |
| ----- | ------ | --------- |
| Inglés desde cero | 0.0001 ETH | `0x761963f20958660130181fa785ddd6efc64fa862` |
| Excel para tu negocio | 0.0001 ETH | `0x911f1a42bdf3a896aa170a3ab3adde1e015e1eae` |
| Reparación de celulares | 0.0002 ETH | `0xa00fa3e21a65a77ba17953d88f926b650160313c` |

Contrato Unlock en Sepolia: `0x36b34e10295cCE69B652eEB5a8046041074515Da`

**Transacciones de ejemplo, verificadas en Sepolia:**

| Qué | Hash | Bloque |
| --- | ---- | ------ |
| Compra de "Inglés desde cero" | `0xf2af70a9acaa6e66a2346e5defb36c31cb5fd4af05f5c7fc89d30c4129d4d2ca` | 11691183 |
| Compra de "Reparación de celulares" | `0xe8ed5b6541fd467c7c5aa48386ecec7462e3f2f4fa678f593d978b60d815bd26` | 11693688 |
| **Transferencia del acceso** | `0xc470ff5dd67f8cbc33dd7403e1d5aa3e1ce6100be0c4a86b4b9d22b925046099` | 11694004 |

La transferencia pasó el acceso de `0x567FCdC…413aC` a `0xa6fc1c38…02e39`.
Tras ella, `getHasValidKey` devuelve `false` para el primero y `true` para el
segundo: el acceso cambió de dueño, y solo una persona lo tiene a la vez.

---

## Cómo cumple los requisitos del bounty

| Requisito | Dónde |
| --------- | ----- |
| Creadores publican contenido restringido | Catálogo, cada curso atado a su Lock |
| Visitantes previsualizan una parte | Primera clase libre; el resto con candado |
| Verificar la membresía de Unlock | `getHasValidKey` en `hooks/useMembresia.ts` |
| Otorgar acceso con membresía válida | Render condicional en `VistaCurso.tsx` |
| Camino claro para comprar | `purchase()` en `hooks/useComprarAcceso.ts` |

**Los tres puntos que conviene destacar:**

1. **`getHasValidKey`, nunca `balanceOf`.** `balanceOf` devuelve 1 aunque la
   membresía esté vencida, porque el NFT permanece en la wallet. Solo
   `getHasValidKey` comprueba la validez temporal dentro del contrato.

2. **El gating es real.** Sin membresía, las URLs de las clases de pago no
   llegan al navegador: no se renderizan ni se ocultan con CSS, sencillamente
   no existen en la página.

3. **El linaje del acceso.** Qupuy lee los eventos `Transfer` del Lock para
   mostrar por cuántas manos ha pasado un curso. Ninguna plataforma puede hacer
   esto — Udemy no sabe a quién le prestaste tu cuenta.

4. **Pasar el acceso escaneando un código.** Pedirle a alguien que dicte su
   dirección rompe el caso real: dos personas que están juntas. El receptor
   abre `/recibir` y muestra un QR; quien pasa el acceso lo escanea desde el
   modal. La transferencia verificada se hizo así.

---

## Guion del video (3 minutos)

| Tiempo | Qué mostrar | Qué decir |
| ------ | ----------- | --------- |
| 0:00-0:25 | La portada | "Bolivia es el único país de Latinoamérica sin PayPal. MercadoPago tampoco opera aquí. Un profesor boliviano no tiene forma de cobrar por internet." |
| 0:25-0:45 | El logo y la cadena de la portada | "Qupuy. En quechua significa dar a otro — y también pagar. Una sola palabra para las dos cosas que hace el producto." |
| 0:45-1:15 | Entrar a un curso **sin wallet** | "Cualquiera ve la primera clase. Las demás están cerradas — y no ocultas con CSS: el video ni siquiera llega al navegador." |
| 1:15-1:55 | Conectar wallet y comprar | "Compro la membresía… y el contenido aparece solo. No lo decide mi aplicación: lo decide el contrato de Unlock." |
| 1:55-2:35 | **Pasar el acceso** a otra wallet | "Y aquí está lo que ninguna plataforma permite: le paso mi acceso a otra persona. Yo lo pierdo, ella lo gana. Solo uno a la vez." |
| 2:35-3:00 | El linaje actualizado | "Y la cadena queda registrada. Udemy no sabe a quién le prestaste tu cuenta. Aquí es público y verificable. Cuando terminas, lo pasas." |

**Consejos de grabación:**

- Ten **dos ventanas** listas: la app y MetaMask con las dos cuentas.
- Compra el acceso **antes** de grabar, para no esperar la confirmación en vivo,
  o usa un segundo curso para la compra en directo.
- Termina en el linaje: es el plano que se recuerda.

---

## Antes de enviar

- [x] Ejecutar una transferencia real — bloque 11694004, hash arriba
- [x] Comprobar que el repositorio es público
- [x] Locks desplegados y verificados en Sepolia
- [ ] Grabar el video (≤ 3 minutos)
- [ ] Revisar que la URL carga desde otro dispositivo
- [ ] Copiar la declaración de código preexistente del README
