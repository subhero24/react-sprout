import Path from 'path';
import Express from 'express';
import Filesystem from 'fs';

import { createServer } from 'vite';
import { fileURLToPath } from 'url';

let __dirname = Path.dirname(fileURLToPath(import.meta.url));

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
	// let url = req.protocol + '://' + req.get('host') + req.originalUrl;
	try {
		let url = req.originalUrl;

		let template = Filesystem.readFileSync(Path.resolve(__dirname, 'index.html'), 'utf-8');
		let templateVite = await vite.transformIndexHtml(url, template);

		let module = await vite.ssrLoadModule('server.jsx');
		let htmlOriginal = await module.default(req, res);
		let htmlTransformed = templateVite.replace(`<!-- app -->`, htmlOriginal);

		res.status(200).set({ 'Content-Type': 'text/html' }).end(htmlTransformed);
	} catch (error) {
		vite.ssrFixStacktrace(error);
		next(error);
	}
});

application.listen(5173);
