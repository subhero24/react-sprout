import Redirect, { RedirectError } from './redirect.js';

import { resolvePaths } from './path.js';
import { isEquivalentObject } from './object.js';
import { matchQuery, filterQuery } from './query.js';
import { matchDescriptor, interpolateDescriptor } from './descriptor.js';

export function createMatch(configs, request, context) {
	let { root = '/', params: parentParams = {} } = context ?? {};

	let location = new URL(request.url);
	for (let config of configs) {
		let strict = config.children == undefined && config.pathname !== '';
		let pathnameDescriptor = resolvePaths(root, config.pathname);

		let matchedSearch = matchQuery(config.search, location.search);
		let matchedDescriptor = matchDescriptor(pathnameDescriptor, location.pathname, strict);
		if (matchedDescriptor && matchedSearch) {
			let { base, pathname, rest, splat, params: elementParams } = matchedDescriptor;

			let params = { ...parentParams, ...elementParams };

			let type = config.type;
			if (type === Redirect) {
				let path;
				if (typeof config.to === 'function') {
					path = config.to({ splat, params });
				} else {
					path = interpolateDescriptor(config.to, params, splat);
				}

				let url = resolvePaths(root, path);
				let target = new URL(url, location);
				throw new RedirectError(`Redirecting from ${location} to ${target}`, target, config.status);
			}

			let url;
			let search = filterQuery(location.search, config.search);
			let searchKeys = [...search.keys()];
			if (searchKeys.length) {
				url = new URL(pathname + '?' + search, location);
			} else {
				url = new URL(pathname, location);
			}

			let match = { config, url, base, rest, splat, params, search };

			let children = config.children;
			if (children) {
				let root = base;
				let matches = createMatch(children, request, { root, params });
				if (matches == undefined) {
					continue;
				} else {
					match.children = matches;
				}
			}

			return match;
		}
	}
}

export function isEquivalentMatch(objectA, objectB) {
	if (objectA === objectB) return true;

	let sameComponent = objectA.config.type === objectB.config.type;
	if (sameComponent) {
		let sameLoader = objectA.config.loader === objectB.config.loader;
		if (sameLoader) {
			let sameUrl = objectA.url.href === objectB.url.href;
			if (sameUrl) {
				// We still need to check splat and params, even though the url is the same
				// because the matched path descriptor could be different, effectively changing params and/or splat
				// even though the url is the same
				let sameSplat = isEquivalentObject(objectA.splat, objectB.splat);
				if (sameSplat) {
					let sameParams = isEquivalentObject(objectA.params, objectB.params);
					if (sameParams) {
						return true;
					}
				}
			}
		}
	}

	return false;
}
