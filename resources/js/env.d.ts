/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  // add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: (pattern: string) => any;
}
