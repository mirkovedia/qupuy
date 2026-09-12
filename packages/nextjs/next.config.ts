import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  // El SDK de Coinbase (dependencia transitiva de Scaffold-ETH 2) importa
  // @x402/evm, que no está instalado. Qupuy no usa x402 ni ese SDK, así que la
  // ruta nunca se ejecuta — pero el build de producción analiza el árbol
  // completo de dependencias y falla al resolverlo. Se redirige a un módulo
  // vacío.
  //
  // Next.js 16 usa Turbopack por defecto, que tiene su propia configuración de
  // alias: no lee la de webpack.
  turbopack: {
    resolveAlias: {
      "@x402/evm": "./stubs/vacio.ts",
      "@x402/core": "./stubs/vacio.ts",
    },
  },
};

const isIpfs = process.env.NEXT_PUBLIC_IPFS_BUILD === "true";

if (isIpfs) {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images = {
    unoptimized: true,
  };
}

module.exports = nextConfig;
