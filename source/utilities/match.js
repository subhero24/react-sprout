import Redirect from '../components/redirect.jsx';

import { resolvePaths } from './path.js';
import { isEquivalentObject } from './object.js';
import { matchQuery, filterQuery } from './query.js';
import { matchDescriptor, interpolateDescriptor, resolveDescriptors } from './descriptor.js';

export function createMatch(configs, requested, context) {
	let { root: parentRoot = '/', params: parentParams = {}, matched } = context ?? {};

	let location = new URL(requested.url);
	for (let config of configs) {
		if (matched && config.score < matched.config.score) break;

		let strict = config.children == undefined && config.pathname !== '';
		let pathname = resolveDescriptors(parentRoot, config.pathname);
		let matchedSearch = matchQuery(config.search, location.search);
		let matchedDescriptor = matchDescriptor(pathname, location.pathname, strict);
		if (matchedDescriptor && matchedSearch) {
			let { root, base, rest, splat, params: matchedParams } = matchedDescriptor;

			let params = { ...parentParams, ...matchedParams };

			let type = config.type;
			if (type === Redirect) {
				let path;
				if (typeof config.to === 'function') {
					path = config.to({ splat, params });
				} else {
					path = interpolateDescriptor(config.to, params, splat);
				}

				let redirectPath = resolvePaths(parentRoot, path);
				let redirectUrl = new URL(redirectPath, location);

				throw Response.redirect(redirectUrl, config.status ?? 308);
			}

			let request;
			let searchParams = filterQuery(location.search, config.search);
			let searchKeys = [...searchParams.keys()];
			if (searchKeys.length) {
				request = new Request(new URL(root + '?' + searchParams, location));
			} else {
				request = new Request(new URL(root, location));
			}

			let match = { config, request, base, rest, splat, params };

			let children = config.children;
			if (children?.length) {
				let matches = createMatch(children, requested, { root, params, matched: matched?.children });
				if (matches == undefined) continue;
				if (matched) matched = match;

				match.children = matches;
			}

			if (matched == undefined || matched.config.score < match.config.score) {
				matched = match;
			}
		}
	}
	return matched;
}

export function isEquivalentMatch(matchA, matchB) {
	if (matchA === matchB) return true;

	let sameComponent = matchA.config.type === matchB.config.type;
	if (sameComponent) {
		let sameLoader = matchA.config.loader === matchB.config.loader;
		if (sameLoader) {
			let sameUrl = matchA.request.url === matchB.request.url;
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
