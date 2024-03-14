import Express from 'express';

import { createServer } from 'vite';

let vite = await createServer({
	appType: 'custom',
	server: { middlewareMode: true },
	esbuild: {
		jsxInject: `import React from 'react'`,
	},
});

let application = Express();

application.use(vite.middlewares);

application.use('*', async function (req, res, next) {
	try {
		let url = req.protocol + '://' + req.get('host') + req.originalUrl;
		let body = req.body;
		let method = req.method;
		let headers = req.headers;
		let request = new Request(url, { body, method, headers });

		let module = await vite.ssrLoadModule('server.jsx');
		let result = await module.default(request, res);
	} catch (error) {
		vite.ssrFixStacktrace(error);
		next(error);
	}
});

application.listen(5173);
