/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_REGION: string
  readonly VITE_PORTAL_ID: string
  readonly VITE_FORM_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
