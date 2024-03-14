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
						data = dataTransform(data);
					}
				}

				actionResult = await action({ url, splat, params, data, signal });
			} else {
				actionResult = await action;
			}

			if (actionResult instanceof Response) {
				if (actionResult.ok) {
					return await createData(actionResult);
				} else {
					let status = actionResult.status;
					if (status >= 300 && status < 400) {
						return actionResult;
					} else {
						throw actionResult;
					}
				}
			} else {
				return actionResult;
			}
		}
	}
}
