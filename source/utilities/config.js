import { Fragment, isValidElement } from 'react';

import Redirect from '../components/redirect.jsx';

import configConsole from './console.js';

import { childrenToArray } from './children.js';
import { descriptorScore, descriptorStructure, equivalentDescriptors } from './descriptor.js';
import { joinPaths, pathParts, resolvePaths } from './path.js';

export function createConfig(root = [], options) {
	if (import.meta.env?.DEV && root instanceof Array && root.length === 0) {
		console.warn(`No routes are specified. The router will not render anything.`);
	}

	let duplicates = [];

	let rootRoute = createRouteObject(root);
	let rootConfigs = createConfigs([rootRoute]);

	return rootConfigs;

	function createConfigs(routes, context) {
		let { base = '/', level = 0 } = context ?? {};

		let validRoutes = routes.filter(verifyNoRouteErrors);
		let validScores = routeDescriptorScores(validRoutes);
		let sortedRoutes = sortRoutesByDescriptorScore(validRoutes, validScores);

		validRoutes.forEach(verifyNoRouteWarnings);

		return sortedRoutes.map(route => {
			let { type, path, root, to, status, loader, action, children } = route;

			let [pathname, search] = pathParts(path);

			let score = validScores[path];

			let server = {};

			if (action) server.action = createConfigAction(options, context);
			if (loader) server.loader = createConfigLoader(options, context);

			if (action === true) action = server.action;
			if (loader === true) loader = server.loader;

			let childBase = resolvePaths(base, path);
			let childContext;
			let childConfigs;

			let childrenArray = childrenToArray(children);
			if (childrenArray.length) {
				childContext = { base: childBase, level: level + 1 };
				childConfigs = createConfigs(childrenArray, childContext);
			} else {
				let descriptorPath = path == undefined ? joinPaths(childBase, '*') : childBase;

				let structure = descriptorStructure(descriptorPath);
				let duplicate = duplicates.find(duplicate => equivalentDescriptors(duplicate.structure, structure));
				if (duplicate && process.env.NODE_ENV) {
					configConsole.warn(
						`There are two routes which will match the same url. The second route will never render.`,
						rootRoute,
						[duplicate.route, route],
					);
				} else {
					duplicates.push({ route, structure });
				}
			}

			if (type === Redirect) {
				return { type, path, pathname, search, score, level, to, status, action, server };
			} else {
				return {
					type,
					path,
					pathname,
					search,
					score,
					level,
					root,
					status,
					loader,
					action,
					server,
					children: childConfigs,
				};
			}
		});
	}

	function assertNoRouteErrors(route) {
		assertRouteIsNotString(route);
	}

	function verifyNoRouteErrors(route) {
		try {
			assertNoRouteErrors(route);
		} catch (error) {
			if (process.env.NODE_ENV && error instanceof RouterConfigError) {
				configConsole.warn(error.message, rootRoute, [route]);
				return false;
			} else {
				throw error;
			}
		}

		return true;
	}

	function assertNoRouteWarnings(route) {
		assertRoutePathHasNoHash(route);
		assertRouteRedirectHasNoLoader(route);
		assertRouteRedirictHasNoChildren(route);
		assertRouteWithoutChildrenIsNotRoot(route);
	}

	function verifyNoRouteWarnings(route) {
		try {
			assertNoRouteWarnings(route);
		} catch (error) {
			if (process.env.NODE_ENV && error instanceof RouterConfigError) {
				configConsole.warn(error.message, rootRoute, [route]);
			} else {
				throw error;
			}

			return false;
		}

		return true;
	}
}

function createRouteObject(root) {
	let rootRoute;
	let rootIsArray = root instanceof Array;
	if (rootIsArray) {
		rootRoute = { type: Fragment, children: root };
	} else {
		rootRoute = root;
	}

	return createRouteObjects([rootRoute])[0];

	function createRouteObjects(routes) {
		return routes.map(route => {
			let isReactElement = isValidElement(route);
			if (isReactElement) {
				let { type, children, ...other } = route.props;

				let childrenArray = childrenToArray(children);
				if (childrenArray.length) {
					return { type: route.type, ...other, children: createRouteObjects(childrenArray) };
				} else {
					return { type: route.type, ...other };
				}
			} else {
				return route;
			}
		});
	}
}

export class RouterConfigError extends Error {}

function assertRouteIsNotString(route) {
	if (typeof route === 'string') {
		throw new RouterConfigError(
			`There is a text node "${route}" in the routes configuration. Routes need to be specified by objects or react elements. Please remove this text node to fix this.`,
		);
	}
}

function assertRouteRedirectHasNoLoader(element) {
	if (element.type === Redirect && element.loader) {
		throw new RouterConfigError(
			`There is a Redirect route with a loader. Redirect routes should not load data as they will not render. Please remove the loader to fix this.`,
		);
	}
}

function assertRouteRedirictHasNoChildren(element) {
	if (element.type === Redirect && element.children) {
		throw new RouterConfigError(
			`There is a Redirect route with child routes. Redirect routes should not have child routes. Please remove the child routes to fix this.`,
		);
	}
}

function assertRouteWithoutChildrenIsNotRoot(element) {
	if (element.root && element.children) {
		throw new RouterConfigError(
			`There is a root route without child routes. Please remove the root property to fix this.`,
		);
	}
}

function assertRoutePathHasNoHash(element) {
	if (element.path != undefined) {
		let hash = pathParts(element.path)[2];
		if (hash) {
			throw new RouterConfigError(
				`There is a route with a hash "#${hash}". Hashes should not be used in your route paths. Please remove the hash "#${hash}" to fix this.`,
			);
		}
	}
}

function routeDescriptorScores(routes) {
	// We use an object instead of a map because we would like a score for an 'undefined' path
	let scores = {};
	for (let route of routes) {
		let path = route.path;
		let score = scores[path];
		if (score == undefined) {
			scores[path] = descriptorScore(path);
		}
	}
	return scores;
}

function sortRoutesByDescriptorScore(routes, scores) {
	return routes.sort(function (a, b) {
		let scoreA = scores[a.path];
		let scoreB = scores[b.path];

		if (scoreA < scoreB) return 1;
		if (scoreA > scoreB) return -1;

		return 0;
	});
}

export function createConfigLoader(options, context) {
	let level = context?.level;
	let prefix = options?.prefix ?? '';

	return async function loader({ url }) {
		return fetch(`${prefix}${url.pathname}${url.search}`, {
			headers: { Accept: 'application/json', Range: `route=${level}` },
		});
	};
}

export function createConfigAction(options) {
	let prefix = options?.prefix ?? '';

	return async function action({ url, data }) {
		let requestPathname = `${prefix}${url.pathname}${url.search}`;
		let response = await fetch(requestPathname, {
			method: 'POST',
			body: data,
			headers: {
				Accept: 'application/json',
			},
		});
		let responseUrl = new URL(response.url);
		let responsePathname = responseUrl.href.slice(responseUrl.origin.length);
		if (responsePathname !== requestPathname) {
			return Response.redirect(responseUrl, 303);
		}

		return response;
	};
}
