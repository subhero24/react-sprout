import { RedirectError } from './redirect.js';

import { createMatch } from './match.js';

import { urlToPath } from './url.js';

import { development } from './environment.js';

export function createRender(configs, request) {
	let redirect = request.redirect === 'follow';
	let redirects = [];
	while (true) {
		try {
			let root = createMatch(configs, request);
			if (root == undefined && import.meta.env.dev) {
				console.warn(`No routes matched ${urlToPath(new URL(request.url))}`);
			}

			return { request, root };
		} catch (error) {
			if (error instanceof RedirectError && redirect) {
				if (import.meta.env.dev) {
					console.debug(error.message);
				}

				let path = urlToPath(error.to);
				let pathIsRedirectLoop = redirects.includes(path);
				if (pathIsRedirectLoop) {
					let trail = [...redirects, path].join(' to ');

					throw new Error(`There was an infinite loop of redirects. Redirecting from ${trail}.`);
				} else {
					request = new Request(error.to);
					redirects.push(error.to);
				}
			} else {
				throw error;
			}
		}
	}
}

export class NotFoundError extends Error {}
