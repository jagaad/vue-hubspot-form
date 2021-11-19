import { createApp, defineComponent, h } from 'vue'
import HubSpotForm, { Payload } from './hubspot-form'

document.body.style.margin = '0'
const size = { width: '100vw', height: '100vh' }
const createSquare = (backgroundColor: string) => defineComponent({
    render: () => h('div', { style: { ...size, backgroundColor } })
})

const fallback = createSquare('#bada55')
const error = createSquare('#b00b55')

const options = {
    region: import.meta.env.VITE_REGION,
    portalId: import.meta.env.VITE_PORTAL_ID,
    formId: import.meta.env.VITE_FORM_ID,
    // JSS can be used to write styles in a batter way
    cssRequired: `.hubspot-link__container { display: none }`
}

const onReady = (payload: Payload) => console.log(payload)

const props = { fallback, error, options, onReady }
createApp(HubSpotForm, props).mount('#app')
