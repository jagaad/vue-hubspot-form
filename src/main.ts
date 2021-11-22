import { createApp, defineComponent, h } from 'vue'
import HubSpotForm from './hubspot-form'
import jss, { Rule } from 'jss'

document.body.style.margin = '0'
const size = { width: '100vw', height: '100vh' }
const createSquare = (backgroundColor: string) => defineComponent({
    render: () => h('div', { style: { ...size, backgroundColor } })
})

const fallback = createSquare('#bada55')
const error = createSquare('#b00b55')

jss.use({
    onCreateRule(name, _decl, options) {
        options.selector = name
        return null as unknown as Rule
    }
})

const styleSheet = jss.createStyleSheet({
    '.hubspot-link__container': {
        display: 'none',
    },
})

const options = {
    region: import.meta.env.VITE_REGION,
    portalId: import.meta.env.VITE_PORTAL_ID,
    formId: import.meta.env.VITE_FORM_ID,
    cssRequired: styleSheet.toString()
}

const props = { fallback, error, options }
createApp(HubSpotForm, props).mount('#app')
