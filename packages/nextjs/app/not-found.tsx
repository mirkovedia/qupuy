import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center h-full flex-1 justify-center">
      <div className="text-center px-4">
        <p className="dato text-base-content/40 m-0 mb-3">404</p>
        <h1 className="text-4xl sm:text-5xl font-display leading-none m-0 mb-3">Esta página no existe</h1>
        <p className="text-base-content/65 m-0 mb-6">Puede que el enlace esté mal escrito o que el curso ya no esté.</p>
        <Link href="/" className="btn btn-primary btn-sm">
          Ver el catálogo
        </Link>
      </div>
    </div>
  );
}
