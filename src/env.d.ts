/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_INIT_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 