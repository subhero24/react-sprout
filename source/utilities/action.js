import { createResource } from './resource';

export function createAction(render, options) {
	let { detail, scheduler } = options ?? {};

	let match;
	let matched = render.root;
	while (matched) {
		match = matched.config.action ? matched : match;
		matched = matched.children;
	}

	if (match == undefined) {
		if (import.meta.env.dev) {
			console.warn(`No action handler was found`);
		}
	} else {
		let action = match.config.action;
		let request = render.request;

		let promise = createActionPromise();
		let resource = createResource(promise, scheduler);
		let controller = new AbortController();

		request.signal.addEventListener('abort', () => controller.abort(), { once: true });

		return { match, promise, resource, controller };

		async function createActionPromise() {
			let actionType = typeof action;
			if (actionType === 'function') {
				let url = new URL(request.url);
				let data = detail?.data;
				let enctype = detail?.enctype;
				let formData = detail?.formData;
				let { splat, params } = match;

				return action({ url, splat, params, data, formData, enctype, request });
			} else {
				return action;
			}
		}
	}
}
