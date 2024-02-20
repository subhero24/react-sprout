import Redirect, { RedirectError } from './redirect.js';

import { pathParts, resolvePaths } from './path.js';
import { isEquivalentObject } from './object.js';
import { matchQuery, filterQuery } from './query.js';
import { matchDescriptor, interpolateDescriptor } from './descriptor.js';

export function createMatch(configs, requested, context) {
	let { root = '/', params: parentParams = {} } = context ?? {};

	let location = new URL(requested.url);
	for (let config of configs) {
		let [pathPathname, pathSearch] = pathParts(config.path);

		let strict = config.children == undefined && pathPathname !== '';
		let pathnameDescriptor = resolvePaths(root, pathPathname);

		let matchedSearch = matchQuery(pathSearch, location.search);
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
			let searchParams = filterQuery(location.search, pathSearch);
			let searchKeys = [...searchParams.keys()];
			if (searchKeys.length) {
				url = new URL(pathname + '?' + searchParams, location);
			} else {
				url = new URL(pathname, location);
			}

			let match = { config, url, base, rest, splat, params };

			let children = config.children;
			if (children?.length) {
				let root = base;
				let matches = createMatch(children, requested, { root, params });
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

export function isEquivalentMatch(matchA, matchB) {
	if (matchA === matchB) return true;

	let sameComponent = matchA.config.type === matchB.config.type;
	if (sameComponent) {
		let sameLoader = matchA.config.loader === matchB.config.loader;
		if (sameLoader) {
			let sameUrl = matchA.url.href === matchB.url.href;
			if (sameUrl) {
				// We still need to check splat and params, even though the url is the same
				// because the matched path descriptor could be different, effectively changing params and/or splat
				// even though the url is the same
				let sameSplat = isEquivalentObject(matchA.splat, matchB.splat);
				if (sameSplat) {
					let sameParams = isEquivalentObject(matchA.params, matchB.params);
					if (sameParams) {
						return true;
					}
				}
			}
		}
	}

	return false;
}
