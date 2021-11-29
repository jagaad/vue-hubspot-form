import { isVue2, h as demiH } from "vue-demi"

interface Options {
    props?: Object,
    domProps?: Object
}

export const h = (type: String | Object, options: Options = {}, chidren?: any) => {
    if (isVue2) return demiH(type, options, chidren)
    const { props, domProps, ...extraOptions } = options
    const params = { ...extraOptions, ...props, ...domProps }
    return demiH(type, params, chidren)
}