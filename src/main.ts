import { createApp, h } from 'vue'
import HubSpotForm from './hubspot-form'

createApp(() => h(HubSpotForm, {
    region: import.meta.env.VITE_REGION,
    portalId: import.meta.env.VITE_PORTAL_ID,
    formId: import.meta.env.VITE_FORM_ID,
    styles: {
        '.hubspot-link__container': {
            display: 'none'
        }
    }
})).mount('#app')
