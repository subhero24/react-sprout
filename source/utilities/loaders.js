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
				let dirty = false;
				let request = render.request;
				let promise = createLoaderPromise();
				let resource = createResource(promise, scheduler);
				let controller = new AbortController();

				request.signal.addEventListener('abort', () => controller.abort(), { once: true });

				result = { dirty, match, promise, resource, controller };

				async function createLoaderPromise() {
					await action;

					let loaderType = typeof loader;
					if (loaderType === 'function') {
						let { url, splat, params, search } = match;

						return loader({ url, splat, params, search, request });
					} else {
						return loader;
					}
				}
			}

			results.push(result);
		}

		matched = match.children;
	}

	return results;
}
