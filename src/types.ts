export type Payload = {
	hbspt: HubSpot;
	form: Form;
	iframe: HTMLIFrameElement;
	iframeDocument: Document;
};
export type Form = { id: string; onReady: (cb: () => void) => void };
export type HubSpot = { forms: { create: (options: _CreateOptions) => Form } };
export type OnReady = (payload: Payload) => void | Promise<void>;

/**
 * All possible options for creating HubSpot form
 * `target` is added by wrapper
 * https://legacydocs.hubspot.com/docs/methods/forms/advanced_form_options
 */
export type CreateOptions = Omit<_CreateOptions, 'target'>;
type _CreateOptions = {
	portalId: string;
	formId: string;
	region: string;
	target: string;
	redirectUrl?: string;
	inlineMessage?: string;
	pageId?: string;
	cssRequired?: string;
	cssClass?: string;
	submitButtonClass?: string;
	errorClass?: string;
	errorMessageClass?: string;
	groupErrors?: boolean;
	locale?: string;
	translations?: Record<string, unknown>;
	manuallyBlockedEmailDomain?: string[];
	formInstanceId?: string;
	onBeforeFormInit?: (...args: unknown[]) => unknown;
	// Works only if you have jQuery on page
	onFormReady?: (...args: unknown[]) => unknown;
	onFormSubmit?: (...args: unknown[]) => unknown;
	onFormSubmitted?: (...args: unknown[]) => unknown;
};
