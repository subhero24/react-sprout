import { createData } from './data.js';
import { createAsyncResource, createSyncResource } from './resource.js';
import { createSyncAsync } from './promise.js';

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
		let result = createSyncAsync().then(createActionData).then(createActionResult).then(handleActionResult);
		let resource;

		let resultValue = result.value;
		if (resultValue instanceof Promise) {
			resource = createAsyncResource(resultValue, scheduler);
		} else {
			resource = createSyncResource(resultValue, result.state);
		}

		let controller = new AbortController();

		signal.addEventListener('abort', () => controller.abort(), { once: true });

		return { match, resource, controller };

		function createActionData() {
			if (event) {
				return event.detail.data;
			} else {
				return createData(request).then(data => (dataTransform ? dataTransform(data, request) : data));
			}
		}

		function createActionResult(data) {
			let actionType = typeof action;
			if (actionType === 'function') {
				let { splat, params } = match;

				let url = new URL(request.url);
				let server = match.config.server.action?.bind(undefined, { url, splat, params, data, signal });

				return action({ url, splat, params, data, signal, server });
			} else {
				return action;
			}
		}

		function handleActionResult(actionResult) {
			let actionResultIsResponse = actionResult instanceof Response;
			if (actionResultIsResponse) {
				let isRedirect = actionResult.status >= 300 && actionResult.status < 400;
				if (isRedirect) {
					return actionResult;
				} else {
					return createData(actionResult).then(actionData => {
						if (actionResult.ok) {
							return actionData;
						} else {
							throw actionData;
						}
					});
				}
			}
			return actionResult;
		}
	}
}
