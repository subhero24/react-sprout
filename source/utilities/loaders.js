import { createData } from './data.js';
import { createResource } from './resource.js';
import { isEquivalentMatch } from './match.js';

export function createLoaders(render, options = {}) {
	let { action, cache, scheduler } = options;

	let loaders = [];
	let matched = render.root;

	while (matched) {
		let match = matched;
		let configLoader = match.config.loader;
		if (configLoader) {
			let loader = cache?.loaders?.find(loader => isEquivalentMatch(match, loader.match));
			if (loader == undefined) {
				let request = render.request;

				let signal = request.signal;
				let result = createLoaderResult();
				let resource = createResource(result, scheduler);
				let controller = new AbortController();

				signal.addEventListener('abort', () => controller.abort(), { once: true });

				loader = { match, resource, controller };

				function createLoaderResult() {
					let actionIsPromise = action instanceof Promise;
					if (actionIsPromise) {
						return action.then(createLoaderResult);
					} else {
						return createLoaderResult();
					}

					function createLoaderResult() {
						let loaderResult;
						let loaderType = typeof configLoader;
						if (loaderType === 'function') {
							let { splat, params } = match;

							let url = new URL(request.url);
							let server = match.config.server.loader?.bind(undefined, { url, splat, params, signal });

							loaderResult = configLoader({ url, splat, params, signal, server });
						} else {
							loaderResult = configLoader;
						}

						let loaderResultIsResponse = loaderResult instanceof Response;
						if (loaderResultIsResponse) {
							return createLoaderResult();

							async function createLoaderResult() {
								let loaderData = await createData(loaderResult);
								if (loaderResult.ok) {
									return loaderData;
								} else {
									throw loaderData;
								}
							}
						}

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
