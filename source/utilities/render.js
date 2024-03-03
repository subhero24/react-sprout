import { createMatch } from './match.js';

import { urlToPath } from './url.js';

export function createRender(configs, request) {
	let redirect = request.redirect === 'follow';
	let redirects = [];
	while (true) {
		let path = urlToPath(new URL(request.url));
		try {
			let root = createMatch(configs, request);
			if (root == undefined && import.meta.env.DEV) {
				console.warn(`No routes matched ${path}`);
			}

			return { request, root };
		} catch (error) {
			let isResponse = error instanceof Response;
			let isRedirect = isResponse && 300 <= error.status && error.status < 400;
			if (isRedirect && redirect) {
				let headers = error.headers;
				let location = headers.get('location');

				let redirectUrl = new URL(location);
				let redirectPath = urlToPath(redirectUrl);

				if (import.meta.env.DEV) {
					console.debug(`Redirecting from ${path} to ${redirectPath}`);
				}

				let pathIsRedirectLoop = redirects.includes(redirectPath);
				if (pathIsRedirectLoop) {
					let trail = [...redirects, redirectPath].join(' to ');

					throw new Error(`There was an infinite loop of redirects. Redirecting from ${trail}.`);
				} else {
					request = new Request(redirectUrl);
					redirects.push(redirectPath);
				}
			} else {
				throw error;
			}
		}
	}
}
