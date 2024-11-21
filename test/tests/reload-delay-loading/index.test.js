import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('reload delay loading', async () => {
	await setup(currentDirectory, '/route', async function ({ page }) {
		await page.waitForSelector('#count');
		await page.click('button');

		let count = await page.$eval('#count', count => count.innerText);
		if (count !== '0') {
			throw new Error('it should have loaded the data');
		}

		await page.waitForNavigation();

		let render = await page.$eval('#root', root => root.innerText);
		if (render === 'fallback') {
			throw new Error('it should have loaded the data before navigation started');
		}
	});
});
