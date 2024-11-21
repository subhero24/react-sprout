import Puppeteer from 'puppeteer-extra';
import PuppeteerPreferences from 'puppeteer-extra-plugin-user-preferences';

import { createServer } from 'vite';

const testing = process.env.NODE_ENV === 'test';

Puppeteer.use(
	PuppeteerPreferences({
		userPrefs: {
			devtools: {
				preferences: {
					currentDockState: '"undocked"',
				},
			},
		},
	}),
);

export default async function (root, path, test) {
	let browser = await Puppeteer.launch({ headless: testing ? false : 'new', devtools: testing });
	let pages = await browser.pages();
	let page = pages[0];

	let server = await createServer({
		root,
		mode: 'test',
		configFile: false,
		server: { port: 1337 },
		esbuild: { jsxInject: `import React from 'react'` },
		logLevel: 'silent',
	});

	await server.listen();
	await page.goto('http://localhost:1337' + path);
	await page.waitForSelector('#watchdog');

	try {
		await test({ server, browser, page });
	} finally {
		if (testing) {
			page.on('close', async () => {
				await server.close();
				await browser.close();
			});
		} else {
			await server.close();
			await browser.close();
		}
	}
}
