import Express from 'express';

import { createData } from '../../utilities/data.js';
import { createMatch } from '../../utilities/match.js';
import { createConfig } from '../../utilities/config.js';

const rangeRegex = /(?<type>\w+)=(?<level>\d+)/;

export default function Routes(...args) {
	let options;
	let elements;
	if (args.length === 1) {
		[elements, options = {}] = args;
	} else if (args.length === 2) {
		[options, elements] = args;
	}

	let { prefix, customErrors = false } = options;

	let router = Express();
	let config = createConfig(elements, { prefix });

	router.use(Express.raw({ type: '*/*' }));

	router.get('*', async function (req, res, next) {
		try {
			let range = req.headers['range']?.match(rangeRegex)?.groups;
			if (range && range.type === 'route') {
				let url = req.protocol + '://' + req.get('host') + req.url;
				let headers = req.headers;
				let request = new Request(url, { headers });

				let match = createMatch(config, request);
				if (match) {
					while (match && match.config.level != range.level) {
						match = match.children;
					}

					if (match == undefined) throw new Error('Route range too high');

					let { url, splat, params } = match;

					let result;
					let loader = match.config.loader;
					if (loader) {
						if (typeof loader === 'function') {
							result = await loader({ url, splat, params, signal: request.signal, request: req });
						} else {
							result = loader;
						}
					}

					if (result instanceof Response) {
						res.status(result.status);
						res.send(await createData(result));
					} else {
						res.send(result);
					}
				} else {
					next();
				}
			} else {
				next();
			}
		} catch (error) {
			next(error);
		}
	});

	router.post('*', async function (req, res, next) {
		try {
			let url = req.protocol + '://' + req.get('host') + req.url;
			let body = req.body;
			let method = req.method;
			let headers = req.headers;
			let request = new Request(url, { body, method, headers });

			let match = createMatch(config, request);
			if (match) {
				let action = match.config.action;
				while (match.children) {
					match = match.children;
					action = match.config.action ?? action;
				}

				let { splat, params } = match;

				let result;
				if (action) {
					if (typeof action === 'function') {
						let url = new URL(request.url);

						let data = await createData(request);
						let signal = request.signal;

						result = await action({ url, splat, params, data, signal, request: req });
					} else {
						result = action;
					}

					if (result instanceof Response) {
						let status = result.status;
						if (status >= 300 && status < 400) {
							res.redirect(result.status, result.headers.get('location'));
						} else {
							res.status(status);
							res.send(await createData(result));
						}
					} else {
						res.send(result);
					}
				} else {
					next();
				}
			} else {
				next();
			}
		} catch (error) {
			next(error);
		}
	});

	router.use(async function (error, req, res, next) {
		try {
			if (error instanceof Response) {
				res.status(error.status);
				res.send(await createData(error));
			} else {
				if (customErrors) {
					throw error;
				} else {
					res.status(400);
					let errorIsError = Object.getPrototypeOf(error) === Error.prototype;
					if (errorIsError) {
						res.send({ message: error.message });
					} else {
						res.send(error);
					}
				}
			}
		} catch (error) {
			next(error);
		}
	});

	return router;
}
