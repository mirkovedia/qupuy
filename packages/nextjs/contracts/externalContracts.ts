import { BLOQUE_DESPLIEGUE } from "./unlock/locks";
import { PUBLIC_LOCK_ABI } from "./unlock/publicLockAbi";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * Los Locks se resuelven dinámicamente en contracts/unlock/locks.ts, que es lo
 * que usa la aplicación. Aquí se declaran además para poder inspeccionarlos
 * desde la página /debug de Scaffold-ETH 2 durante la demo.
 *
 * Las direcciones vienen de .env.local; si falta alguna, cae a la dirección
 * cero y /debug simplemente no devolverá datos para ese contrato.
 */
const DIRECCION_CERO = "0x0000000000000000000000000000000000000000";

const externalContracts = {
  11155111: {
    LockIngles: {
      address: (process.env.NEXT_PUBLIC_LOCK_INGLES ?? DIRECCION_CERO) as `0x${string}`,
      abi: PUBLIC_LOCK_ABI,
      deployedOnBlock: Number(BLOQUE_DESPLIEGUE),
    },
    LockExcel: {
      address: (process.env.NEXT_PUBLIC_LOCK_EXCEL ?? DIRECCION_CERO) as `0x${string}`,
      abi: PUBLIC_LOCK_ABI,
      deployedOnBlock: Number(BLOQUE_DESPLIEGUE),
    },
    LockCelulares: {
      address: (process.env.NEXT_PUBLIC_LOCK_CELULARES ?? DIRECCION_CERO) as `0x${string}`,
      abi: PUBLIC_LOCK_ABI,
      deployedOnBlock: Number(BLOQUE_DESPLIEGUE),
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
