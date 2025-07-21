// types/preline.d.ts
declare global {
  interface Window {
    HSStaticMethods: {
      autoInit(collection?: string | string[] | null): void;
      // Adicione outros métodos aqui se necessário
    };
  }
}

// Adicione esta linha se estiver a usar módulos no seu ficheiro .d.ts
export {};