import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  // El SDK de Coinbase llega como dependencia transitiva de Scaffold-ETH 2 e
  // importa varios subpaquetes de @x402 que no están en el árbol de
  // dependencias. Qupuy no usa x402 ni ese SDK: la ruta nunca se ejecuta, pero
  // el build de producción analiza todo el grafo y falla al resolverlos.
  //
  // Se excluye el SDK del empaquetado en lugar de redirigir cada subpaquete
  // uno a uno, que obligaría a perseguir cada import nuevo.
  serverExternalPackages: ["@coinbase/cdp-sdk"],
  turbopack: {
    resolveAlias: {
      "@x402/evm": "./stubs/vacio.ts",
      "@x402/core": "./stubs/vacio.ts",
      "@x402/core/client": "./stubs/vacio.ts",
      "@x402/svm": "./stubs/vacio.ts",
      "@x402/svm/exact/client": "./stubs/vacio.ts",
      "@x402/evm/exact/client": "./stubs/vacio.ts",
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
