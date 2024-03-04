import { Fragment, isValidElement } from 'react';

import Redirect from '../components/redirect.jsx';

import configConsole from './console.js';

import { joinPaths, pathParts, resolvePaths } from './path.js';
import { childrenToArray } from './children.js';
import { descriptorScore, descriptorStructure, equivalentDescriptors } from './descriptor.js';

export function createConfig(root = [], options) {
	if (import.meta.env.DEV && root instanceof Array && root.length === 0) {
		console.warn(`No routes are specified. The router will not render anything.`);
	}

	let duplicates = [];
	let optionsPrefix = options?.prefix ?? '';

	let rootRoute = createRouteObject(root);
	let rootConfigs = createConfigs([rootRoute]);

	return rootConfigs;

	function createConfigs(routes, options) {
		let { base = '/', level = 0 } = options ?? {};

		let validRoutes = routes.filter(verifyNoRouteErrors);
		let sortedRoutes = sortRoutesByDescriptorScore(validRoutes);

		validRoutes.forEach(verifyNoRouteWarnings);

		return sortedRoutes.map(element => {
			let { type, path, root, to, status, loader, action, children } = element;

			let score = descriptorScore(path); // Extract this as it is calculated twice (also for sorting in the beginning)
			if (action === true) action = createConfigAction(optionsPrefix);
			if (loader === true) loader = createConfigLoader(optionsPrefix, level);

			let childBase = resolvePaths(base, path);
			let childOptions;
			let childConfigs;

			let childrenArray = childrenToArray(children);
			if (childrenArray.length) {
				childOptions = { base: childBase, level: level + 1 };
				childConfigs = createConfigs(childrenArray, childOptions);
			} else {
				let descriptorPath = path == undefined ? joinPaths(childBase, '*') : childBase;

				let structure = descriptorStructure(descriptorPath);
				let duplicate = duplicates.find(duplicate => equivalentDescriptors(duplicate.structure, structure));
				if (duplicate && import.meta.env.DEV) {
					configConsole.warn(
						`There are two routes which will match the same url. The second route will never render.`,
						rootRoute,
						[duplicate.element, element],
					);
				} else {
					duplicates.push({ element, structure });
				}
			}

			if (type === Redirect) {
				return { type, path, score, to, status, action };
			} else {
				return { type, path, score, root, status, loader, action, children: childConfigs };
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
			if (import.meta.env.DEV && error instanceof RouterConfigError) {
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
			if (import.meta.env.DEV && error instanceof RouterConfigError) {
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

function sortRoutesByDescriptorScore(routes) {
	let scores = {};
	for (let route of routes) {
		let path = route.path;
		if (scores[path] == undefined) {
			scores[path] = descriptorScore(path);
		}
	}

	return routes.sort(function (a, b) {
		if (scores[a.path] < scores[b.path]) return 1;
		if (scores[a.path] > scores[b.path]) return -1;

		return 0;
	});
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

export function createConfigLoader(prefix, level) {
	return async function loader({ request }) {
		let url = new URL(request.url);
		let response = await fetch(`${prefix}${url.pathname}${url.search}`, {
			headers: {
				Accept: 'application/json',
				Range: `route=${level}`,
			},
		});

		let result;
		let contentType = response.headers.get('content-type');
		let contentLength = response.headers.get('content-length');
		if (contentLength > 0 && contentType?.includes('application/json')) {
			result = await response.json();
		} else {
			result = await response.text();
		}

		if (response.ok) {
			return result;
		} else {
			throw response;
		}
	};
}

export function createConfigAction(prefix) {
	return async function action({ request }) {
		let url = new URL(request.url);
		let response = await fetch(`${prefix}${url.pathname}${url.search}`, {
			method: 'POST',
			body: request.body,
			headers: { Accept: 'application/json' },
		});

		let result;
		let contentType = response.headers.get('Content-Type');
		let contentLength = response.headers.get('content-length');
		if (contentLength > 0 && contentType?.includes('application/json')) {
			result = await response.json();
		} else {
			result = await response.text();
		}

		if (response.ok) {
			return result;
		} else {
			throw response;
		}
	};
}
