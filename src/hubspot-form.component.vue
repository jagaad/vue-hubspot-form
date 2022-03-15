<template>
	<div>
		<div ref="divRef" hidden></div>
		<component v-if="isLoading" :is="fallback" />
		<component v-if="isError" :is="error" />
	</div>
</template>

<script lang="ts">
import { Component, defineComponent, PropType, h } from 'vue-demi';
import { CreateOptions, OnReady, Payload } from './types';
import { useHubspotForm } from './use-hubspot-form';

const noopComponent = defineComponent({
	render: () => h('div', { props: { hidden: true } }),
});

export default defineComponent({
	emits: { ready: (payload: Payload) => payload },
	props: {
		onReady: Function as PropType<OnReady>,
		options: {
			type: Object as PropType<CreateOptions>,
			default: () => ({}),
		},
		fallback: {
			type: Object as PropType<Component>,
			default: () => noopComponent,
		},
		error: {
			type: Object as PropType<Component>,
			default: () => noopComponent,
		},
	},
	setup(props, { emit }) {
		const { divRef, isError, isLoading } = useHubspotForm(
			props.options,
			(payload) =>
				typeof props.onReady === 'function'
					? props.onReady(payload)
					: emit('ready', payload),
		);

		return { divRef, isLoading, isError };
	},
});
</script>
