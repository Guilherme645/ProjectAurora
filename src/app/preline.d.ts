// types/preline.d.ts
declare global {
  interface Window {
    HSStaticMethods: {
      autoInit(collection?: string | string[] | null): void;
      // Adicione outros métodos aqui se necessário
    };
  }
}

// Adicione esta linha de volta para que o arquivo seja tratado como um módulo
export {};
