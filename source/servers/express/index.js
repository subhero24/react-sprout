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

	let router = Express();
	let config = createConfig(elements, options);

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
					console.log(match);
					while (match && match.config.level != range.level) {
						match = match.children;
					}

					console.log(match, range);

					if (match == undefined) throw new Error('Route range too high');

					let { url, splat, params } = match;

					let result;
					let loader = match.config.loader;
					if (loader) {
						if (typeof loader === 'function') {
							result = await loader({ url, splat, params, signal: request.signal });
						} else {
							result = loader;
						}
					}

					if (result instanceof Response) {
						res.status(result.status);

						if (result.ok) {
							result = await createData(result);
						}
					}

					return res.json(result).end();
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

						result = await action({ url, splat, params, data, signal });
					} else {
						result = action;
					}

					if (result instanceof Response) {
						let status = result.status;
						if (status >= 300 && status < 400) {
							// result.headers.get('location')
							res.redirect(result.status, '/settings');
						} else {
							res.status(status);
							if (result.ok) {
								result = await createData(result);

								res.json(result);
							}
						}
					} else {
						// TODO: other type of results
						res.json(result);
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

				let result = await createData(error);
				if (result != undefined) {
					res.json(result);
				}
				res.end();
			} else {
				// JSON? > { message: '', line: ... }
				res.status(400);
				res.send(error.message);
			}
		} catch (error) {
			next(error);
		}
	});

	return router;
}
