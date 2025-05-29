// types/preline.d.ts
import { HSStaticMethods } from 'preline';

// types/preline.d.ts
declare global {
  interface Window {
    HSStaticMethods: {
      autoInit: () => void;
      // Add other methods if needed based on Preline's documentation
    };
  }
}