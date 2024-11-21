import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('reload', async () => {
	await setup(currentDirectory, '/route', async function ({ page }) {
		let renderBefore = await page.$eval('#root', root => root.innerText);
		if (renderBefore !== 'fallback') {
			throw new Error('it should have suspended');
		}
		await page.waitForSelector('#count');
		let countBefore = await page.$eval('#count', count => count.innerText);
		if (countBefore !== '0') {
			throw new Error('it should have loaded the data');
		}
		await page.click('button');
		await page.waitForSelector('#fallback');
		let renderAfter = await page.$eval('#root', root => root.innerText);
		if (renderAfter !== 'fallback') {
			throw new Error('it should have suspended again');
		}
		await page.waitForNavigation();
		let countAFter = await page.$eval('#count', count => count.innerText);
		if (countAFter !== '1') {
			throw new Error('it should have reloaded the data');
		}
	});
});
