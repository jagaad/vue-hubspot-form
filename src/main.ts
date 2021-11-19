import { createApp, defineComponent, h } from 'vue'
import HubSpotForm from './hubspot-form'

document.body.style.margin = '0'
const size = { width: '100vw', height: '100vh' }
const createSquare = (backgroundColor: string) => defineComponent({
    render: () => h('div', { style: { ...size, backgroundColor } })
})

const LoadingComponent = createSquare('#bada55')
const ErrorComponent = createSquare('#b00b55')

createApp(() => h(HubSpotForm, {
    region: import.meta.env.VITE_REGION,
    portalId: import.meta.env.VITE_PORTAL_ID,
    formId: import.meta.env.VITE_FORM_ID,
    fallback: LoadingComponent,
    error: ErrorComponent,
    styles: {
        '.hubspot-link__container': {
            display: 'none'
        }
    },
})).mount('#app')
