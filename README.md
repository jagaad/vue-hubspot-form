# HubSpot Vue Form

A Vue wrapper for HubSpot Forms

## Usage

```shell
npm install @jagaad/vue-hubspot-form
```

```vue
<script setup>
import HubspotForm from "@jagaad/vue-hubspot-form";
</script>
<template>
  <HubspotForm
    @ready="onReady"
    :options="options"
    :fallback="fallback"
    :error="error"
  ></HubspotForm>
</template>
```

All examples make use partially of code blocks defined below

<details>
<summary>Example 1: using `onReady` as emit</summary>

```vue
<template>
  <HubspotForm
    @ready="onReady"
    :options="options"
    :fallback="fallback"
    :error="error"
  />
</template>
```

</details>

<details>
<summary>Example 2: using `onReady` as callback</summary>

```vue
<template>
  <HubspotForm
    :onReady="onReady"
    :options="options"
    :fallback="fallback"
    :error="error"
  />
</template>
```

</details>

<details>
<summary>Example 3: inject CSS via options</summary>

```tsx
import { CreateOptions } from "@jagaad/vue-hubspot-form";

// these values are fake, add your own
const options: CreateOptions = {
  // ...
  // Read the official docs for more info
  cssRequired: `.hubspot-link__container { display: none }`,
  // ...
};
```

</details>

<details>
<summary>Example 4: inject CSS in `onReady` callback</summary>

```tsx
import { Payload } from "@jagaad/vue-hubspot-form";

function onReady({ iframeDocument: doc }: Payload) {
  const element = doc.createElement("style");
  const styles = `.hubspot-link__container { display: none }`;
  element.appendChild(doc.createTextNode(styles));
  doc.head.appendChild(element);
}
```

</details>

</details>

<details>
<summary>Example 5: inject CSS using JSS in `onReady` callback</summary>

```tsx
import jss, { Styles } from "jss";
import { Payload } from "./hubspot-form";

function onReady({ iframeDocument }: Payload) {
  addClasses(iframeDocument, {
    ".hubspot-link__container": {
      display: "none",
    },
  });
}

// This helper function will add JSS classes to classes from iframe
function addClasses<Name extends string | number | symbol>(
  doc: Document,
  styles: Partial<Styles<Name, any, undefined>>
) {
  const element = doc.createElement("style");
  doc.head.appendChild(element);
  const styleSheet = jss.createStyleSheet(styles, { element }).attach();
  Object.entries(styles).forEach(([currentSelector]) => {
    const newClass = styleSheet.classes[currentSelector as Name];
    const found = doc.querySelectorAll(currentSelector);
    found.forEach(e => e.classList.add(newClass));
  });
}
```

</details>

<details>
<summary>Code Blocks</summary>

**Options:**

```tsx
import { CreateOptions } from "@jagaad/vue-hubspot-form";

// these values are fake, add your own
const options: CreateOptions = {
  region: "eu1",
  portalId: "83991272",
  formId: "25f1e214-1236-45c3-810m-d8dk31736c72",
  // ...
};
```

**On Ready callback:**

```tsx
import { Payload } from "@jagaad/vue-hubspot-form";

const onReady = (payload: Payload) => console.log(payload);
```

**Fallback Components:**

```tsx
import { defineComponent } from "vue";

// Loading Component
const fallback = defineComponent({
  /* ... */
});
// Error Component
const error = defineComponent({
  /* ... */
});
```

</details>

## Contributing

```shell
git clone git@github.com:jagaad/vue-hubspot-form.git
cd vue-hubspot-form
npm install
```

- Create a copy of `.env` file to `.env.local`
- Adjust `.env.local` to your HubSpot values

```
npm run dev
```

## Links

- https://developers.hubspot.com/docs/cms/building-blocks/forms
- https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
- https://github.com/escaladesports/react-hubspot-form/blob/master/src/index.js

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
