import { createData as createRequestData } from './request.js';
import { createData as createResponseData } from './response.js';
import { createResource } from './resource.js';

export function createAction(render, options) {
	let { event, scheduler, dataTransform } = options ?? {};

	let match;
	let matched = render.root;
	while (matched) {
		match = matched.config.action ? matched : match;
		matched = matched.children;
	}

	if (match == undefined) {
		if (import.meta.env.DEV) {
			console.warn(`No action handler was found for ${new URL(render.request.url).pathname}`);
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
			let actionResult;
			let actionType = typeof action;
			if (actionType === 'function') {
				let { url, signal } = request;
				let { splat, params } = match;

				let data = event?.detail.data;
				if (data == undefined) {
					data = await createRequestData(request);
					if (dataTransform) {
						data = dataTransform(data);
					}
				}

				actionResult = await action({ url, splat, params, data, signal });
			} else {
				actionResult = await action;
			}

			if (actionResult instanceof Response) {
				return createResponseData(actionResult);
			} else {
				return actionResult;
			}
		}
	}
}
