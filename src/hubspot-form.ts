import { ref, defineComponent, PropType, Component, watchPostEffect, onErrorCaptured } from "vue-demi";
import { h } from "./h";

export type Payload = { hbspt: HubSpot, form: Form, iframe: HTMLIFrameElement, iframeDocument: Document }
export type Form = { id: string, onReady: (cb: () => void) => void }
export type HubSpot = { forms: { create: (options: _CreateOptions) => Form } }

/**
 * All possible options for creating HubSpot form
 * `target` is added by wrapper
 * https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
 */
export type CreateOptions = Omit<_CreateOptions, 'target'>
type _CreateOptions = {
  portalId: string
  formId: string,
  region: string,
  target: string,
  redirectUrl?: string
  inlineMessage?: string
  pageId?: string
  cssRequired?: string
  cssClass?: string
  submitButtonClass?: string
  errorClass?: string
  errorMessageClass?: string
  groupErrors?: boolean
  locale?: string
  translations?: Record<string, unknown>
  manuallyBlockedEmailDomain?: string[]
  formInstanceId?: string
  onBeforeFormInit?: (...args: unknown[]) => unknown
  // Works only if you have jQuery on page
  onFormReady?: (...args: unknown[]) => unknown
  onFormSubmit?: (...args: unknown[]) => unknown
  onFormSubmitted?: (...args: unknown[]) => unknown
}

function loadHubSpotScript() {
  return loadScript<HubSpot>("//js-eu1.hsforms.net/forms/shell.js", 'hbspt')
}

// This will load script only once, even if form is rendered multiple times
let loadingScript = typeof window !== 'undefined' ? loadHubSpotScript() : undefined
const noopComponent = defineComponent({
  render: () => h('div', { props: { hidden: true } })
})

export default defineComponent({
  emits: { ready: (payload: Payload) => payload },
  props: {
    onReady: {
      type: Function as PropType<(payload: Payload) => void | Promise<void>>,
    },
    options: {
      type: Object as PropType<CreateOptions>,
      default: () => ({})
    },
    fallback: {
      type: Object as PropType<Component>,
      default: () => noopComponent
    },
    error: {
      type: Object as PropType<Component>,
      default: () => noopComponent
    },
  },
  setup(props, { emit }) {
    const isLoading = ref(true)
    const isError = ref(false)
    const divRef = ref<HTMLDivElement>();

    function error() {
      if (divRef.value) divRef.value.hidden = true
      isLoading.value = false
      isError.value = true
    }

    onErrorCaptured(error)

    watchPostEffect(async () => {
      if (!divRef.value) return error()

      divRef.value.hidden = true
      isLoading.value = true
      isError.value = false

      if (!loadingScript) {
        loadingScript = loadHubSpotScript()
      }

      const hbspt = await loadingScript.catch(error)

      if (!hbspt) return error()

      const id = `id-${Math.random().toString().slice(2)}`;
      divRef.value.id = id;

      const form = hbspt.forms.create({ ...props.options, target: `#${id}` });

      if (!form) return error()

      form.onReady(async () => {
        if (!divRef.value) return

        const iframe = divRef.value.querySelector<HTMLIFrameElement>(':scope iframe') ?? undefined;
        const iframeDocument = iframe?.contentDocument ?? undefined;
        const html = iframeDocument?.documentElement

        if (!html || !iframe) return error()

        const payload = { hbspt, form, iframe, iframeDocument }

        if (typeof props.onReady === 'function') {
          await props.onReady(payload)
        } else {
          emit('ready', payload)
        }

        isLoading.value = false
        isError.value = false
        divRef.value.hidden = false
      })
    });

    return () => {
      const children = [
        h('div', { props: { ref: divRef, hidden: true } }),
        isLoading.value && h(props.fallback),
        isError.value && h(props.error),
      ].filter(Boolean)

      return h('div', {}, children)
    }
  }
})

function loadScript<Type>(src: string, umdName: string) {
  return new Promise<Type>((resolve, reject) => {
    const script = window.document.createElement('script')
    script.src = src
    script.defer = true
    script.onload = () => resolve((window as any)[umdName] as Type)
    script.onerror = reject
    window.document.head.appendChild(script)
  })
}