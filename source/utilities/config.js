import { joinPaths, pathParts, resolvePaths } from './path.js';
import { childrenToArray } from './children.js';
import { descriptorScore, descriptorStructure, equivalentDescriptors } from './descriptor.js';

import configConsole from './console.js';

export function createConfig(root, options) {
	let { prefix = '' } = options ?? {};

	let duplicates = [];

	if (import.meta.env.DEV && root == undefined) {
		console.warn(`No routes are specified. The router will not render anything.`);
	}

	return createConfigs(root == undefined ? [] : [root]);

	function createConfigs(elements, options) {
		let { base = '/', level = 0 } = options ?? {};

		let validElements = elements.filter(verifyNoElementErrors);
		let sortedElements = sortElementsByDescriptorScore(validElements);

		validElements.forEach(verifyNoElementWarnings);

		return sortedElements.map(element => {
			let { path, root, loader, action, children, ...other } = element.props;

			if (action === true) action = createConfigAction(prefix);
			if (loader === true) loader = createConfigLoader(prefix, level);

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
						root,
						[duplicate.element, element],
					);
				} else {
					duplicates.push({ element, structure });
				}
			}

			return { ...other, type: element.type, path, root, loader, action, children: childConfigs };
		});
	}

	function assertNoElementErrors(element) {
		assertElementIsNotTextNode(element);
	}

	function verifyNoElementErrors(element) {
		try {
			assertNoElementErrors(element);
		} catch (error) {
			if (import.meta.env.DEV && error instanceof RouterConfigError) {
				configConsole.warn(error.message, root, [element]);
				return false;
			} else {
				throw error;
			}
		}

		return true;
	}

	function assertNoElementWarnings(element) {
		let elementHasPathProperty = element.props.path != undefined;
		if (elementHasPathProperty) {
			assertElementPathHasNoHash(element);
			assertElementPathHasNoInvalidUseOfSplat(element);
		}
	}

	function verifyNoElementWarnings(element) {
		try {
			assertNoElementWarnings(element);
		} catch (error) {
			if (import.meta.env.DEV && error instanceof RouterConfigError) {
				configConsole.warn(error.message, root, [element]);
			} else {
				throw error;
			}

			return false;
		}

		return true;
	}
}

function sortElementsByDescriptorScore(elements) {
	let scores = {};
	for (let element of elements) {
		let path = element.props.path;
		if (scores[path] == undefined) {
			scores[path] = descriptorScore(path);
		}
	}

	return elements.sort(function (a, b) {
		if (scores[a.props.path] < scores[b.props.path]) return 1;
		if (scores[a.props.path] > scores[b.props.path]) return -1;

		return 0;
	});
}

export class RouterConfigError extends Error {}

function assertElementIsNotTextNode(element) {
	if (typeof element === 'string') {
		throw new RouterConfigError(
			`There is a text node "${element}" in the children of your <Router>. Routes need to be specified by react elements. Please remove this text node to fix this.`,
		);
	}
}

function assertElementPathHasNoInvalidUseOfSplat(element) {
	let invalidUseOfSplatSegment = /([^\/]\*)|(\*([^\/]|(\/.)))/;

	let pathname = pathParts(element.props.path)[0];
	if (pathname.match(invalidUseOfSplatSegment)) {
		throw new RouterConfigError(
			`There is a route with invalid use of "*". The splat should be the last segment of the path.`,
		);
	}
}

function assertElementPathHasNoHash(element) {
	let hash = pathParts(element.props.path)[2];
	if (hash) {
		throw new RouterConfigError(
			`There is a route with a hash "#${hash}". Hashes should not be used in your route paths. Please remove the hash "#${hash}" to fix this.`,
		);
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
