import { createData } from './data.js';
import { createSyncAsync } from './promise.js';
import { createSyncResource, createAsyncResource } from './resource.js';
import { isEquivalentMatch } from './match.js';

export function createLoaders(render, options = {}) {
	let { action, cache, scheduler } = options;

	let loaders = [];
	let matched = render.root;
	let actionResult = createSyncAsync(action);

	while (matched) {
		let match = matched;
		let configLoader = match.config.loader;
		if (configLoader) {
			let loader = cache?.loaders?.find(loader => isEquivalentMatch(match, loader.match));
			if (loader == undefined) {
				let request = render.request;

				let signal = request.signal;
				let result = actionResult.then(createLoaderResult).then(handleLoaderResult);
				let resource;

				let resultValue = result.value;
				if (resultValue instanceof Promise) {
					resource = createAsyncResource(resultValue, scheduler);
				} else {
					resource = createSyncResource(resultValue, result.state);
				}

				let controller = new AbortController();

				signal.addEventListener('abort', () => controller.abort(), { once: true });

				loader = { match, resource, controller };

				function createLoaderResult() {
					let loaderType = typeof configLoader;
					if (loaderType === 'function') {
						let { splat, params } = match;

						let url = new URL(request.url);
						let server = match.config.server.loader?.bind(undefined, { url, splat, params, signal });

						return configLoader({ url, splat, params, signal, server });
					} else {
						return configLoader;
					}
				}

				function handleLoaderResult(loaderResult) {
					let loaderResultIsResponse = loaderResult instanceof Response;
					if (loaderResultIsResponse) {
						return createData(loaderResult).then(loaderData => {
							if (loaderResult.ok) {
								return loaderData;
							} else {
								throw loaderData;
							}
						});
					} else {
						return loaderResult;
					}
				}
			}

			loaders.push(loader);
		}

		matched = match.children;
	}

	return loaders;
}
