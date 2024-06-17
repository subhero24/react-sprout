import { createData } from './data.js';
import { createResource } from './resource.js';
import { isEquivalentMatch } from './match.js';

export function createLoaders(render, options = {}) {
	let { loaders, action, scheduler } = options;

	let results = [];
	let matched = render.root;
	while (matched) {
		let match = matched;
		let loader = match.config.loader;
		if (loader) {
			let result = loaders?.find(loader => !loader.dirty && isEquivalentMatch(match, loader.match));
			if (result == undefined) {
				let request = render.request;

				let dirty = false;
				let signal = request.signal;
				let promise = createLoaderPromise();
				let resource = createResource(promise, scheduler);
				let controller = new AbortController();

				signal.addEventListener('abort', () => controller.abort(), { once: true });

				result = { dirty, match, promise, resource, controller };

				async function createLoaderPromise() {
					await action;

					let loaderResult;
					let loaderType = typeof loader;
					if (loaderType === 'function') {
						let { splat, params } = match;

						let url = new URL(request.url);
						let server = match.config.server.loader?.bind({ url, splat, params, signal });

						loaderResult = await loader({ url, splat, params, signal, server });
					} else {
						loaderResult = await loader;
					}

					if (loaderResult instanceof Response) {
						let loaderData = await createData(loaderResult);
						if (loaderResult.ok) {
							return loaderData;
						} else {
							throw loaderData;
						}
					} else {
						return loaderResult;
					}
				}
			}

			results.push(result);
		}

		matched = match.children;
	}

	return results;
}
