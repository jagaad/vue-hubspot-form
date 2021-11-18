import { ref, h, defineComponent, onMounted, PropType } from "vue";

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
    }
  },
  setup(props) {
    const divRef = ref<HTMLDivElement>();

    onMounted(async () => {
      if (!divRef.value) return;

      const id = `id-${Math.random().toString().slice(2)}`;
      divRef.value.id = id;

      (window as any).hbspt.forms.create({
        region: props.region,
        portalId: props.portalId,
        formId: props.formId,
        target: `#${id}`,
      });

      /** using options.onFormReady requires jQuery */
      const iframe = await waitQuerySelector(divRef.value, "iframe");
      const html = iframe.contentDocument?.documentElement;
      if (!html) return;

      for (const [selectors, styles] of Object.entries(props.styles)) {
        const elements = await waitQuerySelectorAll<HTMLElement>(html, selectors)
        const styleEntries = Object.entries(styles) as Array<[string, string]>
        elements.forEach(element => styleEntries.forEach(([property, value]) => {
          // @ts-ignore
          element.style[property] = value
        }))
      }

    });

    return () => h('div', { ref: divRef })
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