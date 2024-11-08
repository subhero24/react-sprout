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
		let result = createActionResult();
		let resource = createResource(result, scheduler);
		let controller = new AbortController();

		signal.addEventListener('abort', () => controller.abort(), { once: true });

		return { match, resource, controller };

		function createActionResult() {
			let actionResult;
			let actionType = typeof action;
			if (actionType === 'function') {
				let { splat, params } = match;

				let dataIsAvailable = event;
				if (dataIsAvailable) {
					actionResult = createActionResult(event.detail.data);
				} else {
					actionResult = createData(request)
						.then(data => (dataTransform ? dataTransform(data, request) : data))
						.then(createActionResult);
				}

				function createActionResult(data) {
					let url = new URL(request.url);
					let server = match.config.server.action?.bind(undefined, { url, splat, params, data, signal });

					return action({ url, splat, params, data, signal, server });
				}
			} else {
				actionResult = action;
			}

			let actionResultIsResponse = actionResult instanceof Response;
			if (actionResultIsResponse) {
				return createActionResult();

				async function createActionResult() {
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
				}
			}

			return actionResult;
		}
	}
}
