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
        </div>
      </div>

      <DebugContracts />
    </div>
  );
};

export default Debug;
