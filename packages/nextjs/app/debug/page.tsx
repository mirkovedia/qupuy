import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Verificar los contratos",
  description: "Consulta directamente los Locks de Unlock que dan acceso a los cursos de Qupuy.",
});

const Debug: NextPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      <header className="mb-8 pb-6 border-b border-base-content/10">
        <h1 className="text-4xl sm:text-5xl font-display leading-none m-0">Verificar los contratos</h1>
        <p className="text-base-content/65 mt-4 mb-0 max-w-2xl leading-relaxed">
          Los tres Locks de Unlock que dan acceso a los cursos, consultables directamente. Aquí puedes comprobar por ti
          mismo quién tiene una membresía válida, sin fiarte de lo que diga la aplicación.
        </p>
      </header>

      <div className="border border-base-content/15 bg-base-100 overflow-hidden mb-8">
        <div className="aguayo" />
        <div className="p-5">
          <h2 className="text-xs uppercase tracking-[0.14em] text-base-content/50 m-0 mb-3">Cómo comprobarlo</h2>
          <ol className="text-sm text-base-content/70 leading-relaxed m-0 pl-5 space-y-1">
            <li>
              Elige un curso abajo y busca <span className="dato">getHasValidKey</span>.
            </li>
            <li>Pega una dirección de wallet y pulsa Read.</li>
            <li>
              El contrato responde <span className="dato">true</span> o <span className="dato">false</span>: eso, y no
              la aplicación, es lo que decide el acceso.
            </li>
          </ol>
          <p className="text-xs text-base-content/50 leading-relaxed mt-3 mb-0">
            Compara con <span className="dato">totalKeys</span>, que cuenta todas las membresías de una wallet —vencidas
            incluidas—, y con <span className="dato">balanceOf</span>, que en esta versión del contrato solo cuenta las
            válidas. Por eso el acceso lo decide <span className="dato">getHasValidKey</span> y no ninguna de las dos.
          </p>

          <div className="mt-5 pt-4 border-t border-base-content/10">
            <h3 className="text-xs uppercase tracking-[0.14em] text-base-content/50 m-0 mb-3">
              Pruébalo con un caso real
            </h3>
            <p className="text-sm text-base-content/65 leading-relaxed m-0 mb-3">
              El acceso a &ldquo;Reparación de celulares&rdquo; se pasó de una wallet a otra. Consulta{" "}
              <span className="dato">getHasValidKey</span> en <span className="dato">LockCelulares</span> con estas dos
              direcciones:
            </p>
            <ul className="m-0 p-0 list-none space-y-2">
              <li className="flex flex-wrap items-baseline gap-x-2">
                <span className="dato text-xs break-all">0xa6fc1c38ebEbda6507272eaaD42033A1e0102e39</span>
                <span className="text-xs text-accent">→ true, lo recibió</span>
              </li>
              <li className="flex flex-wrap items-baseline gap-x-2">
                <span className="dato text-xs break-all">0x567FCdC8e7148a60b91F3367D09EB1b23aF413aC</span>
                <span className="text-xs text-base-content/45">→ false, lo pasó</span>
              </li>
            </ul>
            <p className="text-xs text-base-content/50 leading-relaxed mt-3 mb-0">
              La segunda dirección sí devuelve <span className="dato">true</span> en{" "}
              <span className="dato">LockIngles</span>: ese acceso no se transfirió.
            </p>
          </div>
        </div>
      </div>

      <div className="debug-contratos">
        <DebugContracts />
      </div>
    </div>
  );
};

export default Debug;
