import { createData } from './data.js';
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
		if (process.env.NODE_ENV) {
			console.warn(`No action handler was found for ${new URL(render.request.url).pathname}`);
		}
	} else {
		let action = match.config.action;

		let request = render.request;

		let signal = request.signal;
		let promise = createActionPromise();
		let resource = createResource(promise, scheduler);
		let controller = new AbortController();

		signal.addEventListener('abort', () => controller.abort(), { once: true });

		return { match, promise, resource, controller };

		async function createActionPromise() {
			let actionResult;
			let actionType = typeof action;
			if (actionType === 'function') {
				let { splat, params } = match;

				let url = new URL(request.url);
				let data = event?.detail.data;
				if (data == undefined) {
					data = await createData(request);
					if (dataTransform) {
						data = await dataTransform(data, request);
					}
				}

				let server = match.config.server.action.bind({ url, splat, params, data, signal });

				actionResult = await action({ url, splat, params, data, signal, server });
			} else {
				actionResult = await action;
			}

			if (actionResult instanceof Response) {
				let isRedirect = actionResult.status >= 300 && actionResult.status < 400;
				if (isRedirect) {
					return actionResult;
				} else {
					let actionData = await createData(actionResult);
					if (actionResult.ok) {
						return actionData;
					} else {
						throw actionData;
					}
				}
			} else {
				return actionResult;
			}
		}
	}
}
