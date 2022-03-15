import { ref, watchPostEffect, onErrorCaptured } from 'vue-demi';
import { CreateOptions, HubSpot, OnReady } from './types';

// This will load script only once, even if form is rendered multiple times
let loadingScript =
	typeof window !== 'undefined' ? loadHubSpotScript() : undefined;
const noop = () => {};

export function useHubspotForm(
	options: CreateOptions,
	onReady: OnReady = noop,
) {
	const isLoading = ref(true);
	const isError = ref(false);
	const divRef = ref<HTMLDivElement>();

	function error() {
		if (divRef.value) divRef.value.hidden = true;
		isLoading.value = false;
		isError.value = true;
	}

	onErrorCaptured(error);

	watchPostEffect(async () => {
		if (!divRef.value) return error();

		divRef.value.hidden = true;
		isLoading.value = true;
		isError.value = false;

		loadingScript = loadingScript ?? loadHubSpotScript();

		const hbspt = await loadingScript.catch(error);

		if (!hbspt) return error();

		const id = `id-${Math.random().toString().slice(2)}`;
		divRef.value.id = id;

		const form = hbspt.forms.create({ ...options, target: `#${id}` });

		if (!form) return error();

		form.onReady(async () => {
			if (!divRef.value) return;

			const iframe =
				divRef.value.querySelector<HTMLIFrameElement>(':scope iframe') ??
				undefined;
			const iframeDocument = iframe?.contentDocument ?? undefined;
			const html = iframeDocument?.documentElement;

			if (!html || !iframe) return error();

			const payload = { hbspt, form, iframe, iframeDocument };

			await onReady(payload);

			isLoading.value = false;
			isError.value = false;
			divRef.value.hidden = false;
		});
	});

	return { divRef, isLoading, isError };
}

function loadHubSpotScript() {
	return loadScript<HubSpot>('//js-eu1.hsforms.net/forms/shell.js', 'hbspt');
}

function loadScript<Type>(src: string, umdName: string) {
	return new Promise<Type>((resolve, reject) => {
		const script = window.document.createElement('script');
		script.src = src;
		script.defer = true;
		script.onload = () => resolve((window as any)[umdName] as Type);
		script.onerror = reject;
		window.document.head.appendChild(script);
	});
}
