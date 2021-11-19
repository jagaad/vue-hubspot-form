import { ref, h, defineComponent, PropType, Component, watchPostEffect, onErrorCaptured } from "vue";

// This will load script only once, even if form is rendered multiple times
const loadingScript = loadScript<HubSpot>("//js-eu1.hsforms.net/forms/shell.js", 'hbspt')

type HubSpot = {
  forms: {
    // https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
    create: (options: {
      region: string,
      portalId: string,
      formId: string,
      target: string,
    }) => { id: string }
  }
}

const noopComponent = defineComponent({
  render: () => h('div', { hidden: true })
})

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
    },
    portalId: {
      type: String,
      required: true,
    },
    formId: {
      type: String,
      required: true,
    },
    styles: {
      type: Object as PropType<Record<string, Partial<CSSStyleDeclaration>>>,
      default: () => ({})
    },
    fallback: {
      type: Object as PropType<Component>,
      default: noopComponent
    },
    error: {
      type: Object as PropType<Component>,
      default: noopComponent
    }
  },
  setup(props) {
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

      const hbspt = await loadingScript.catch(error)

      if (!hbspt) return error()

      const id = `id-${Math.random().toString().slice(2)}`;
      divRef.value.id = id;

      hbspt.forms.create({
        region: props.region,
        portalId: props.portalId,
        formId: props.formId,
        target: `#${id}`,
      });

      const iframe = await waitQuerySelector(divRef.value, "iframe");
      const html = iframe.contentDocument?.documentElement;

      if (!html) return error()

      for (const [selectors, styles] of Object.entries(props.styles)) {
        const elements = await waitQuerySelectorAll<HTMLElement>(html, selectors)
        const styleEntries = Object.entries(styles) as Array<[string, string]>
        elements.forEach(element => styleEntries.forEach(([property, value]) => {
          // @ts-ignore
          element.style[property] = value
        }))
      }

      isLoading.value = false
      isError.value = false
      divRef.value.hidden = false
    });

    return () => [
      h('div', { ref: divRef, hidden: true }),
      isLoading.value && h(props.fallback),
      isError.value && h(props.error),
    ].filter(Boolean)
  }
})

function waitQuerySelector<K extends keyof HTMLElementTagNameMap>(element: Element, selectors: K): Promise<HTMLElementTagNameMap[K]>;
function waitQuerySelector<K extends keyof SVGElementTagNameMap>(element: Element, selectors: K): Promise<SVGElementTagNameMap[K]>;
function waitQuerySelector<E extends Element = Element>(element: Element, selectors: string): Promise<E>;
function waitQuerySelector(element: Element, selectors: string) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const found = element.querySelector(selectors)
      if (!found) return;
      clearInterval(interval);
      resolve(found);
    });
  });
}

function waitQuerySelectorAll<K extends keyof HTMLElementTagNameMap>(element: Element, selectors: K): Promise<NodeListOf<HTMLElementTagNameMap[K]>>;
function waitQuerySelectorAll<K extends keyof SVGElementTagNameMap>(element: Element, selectors: K): Promise<NodeListOf<SVGElementTagNameMap[K]>>;
function waitQuerySelectorAll<E extends Element = Element>(element: Element, selectors: string): Promise<NodeListOf<E>>;
function waitQuerySelectorAll(element: Element, selectors: string) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const found = element.querySelectorAll(selectors)
      if (found.length === 0) return;
      clearInterval(interval);
      resolve(found);
    });
  });
}

function loadScript<Type>(src: string, umdName: string) {
  return new Promise<Type>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.defer = true
    script.onload = () => resolve((window as any)[umdName] as Type)
    script.onerror = reject
    document.head.appendChild(script)
  })
}
