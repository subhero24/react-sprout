import Test from 'node:test';

import { fileURLToPath } from 'url';

import sleep from '../../utilities/sleep.js';
import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('sticky reload', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.waitForSelector('#value');

		await page.click('a');

		await sleep(500);

		let value1 = await page.$eval('#value', node => node?.innerText);
		if (value1 !== '1') {
			throw new Error('sticky reload should have kept the previous page while reloading');
		}

		await page.waitForNavigation();

		let value2 = await page.$eval('#value', node => node?.innerText);
		if (value2 !== '2') {
			throw new Error('sticky reload should have reloaded the loader');
		}

		// await page.waitForSelector('#child-a');
		// await Promise.all([page.click('a'), page.waitForNavigation()]);
		// let render = await page.$eval('#root', root => root.innerText);
		// if (render !== 'Navigate to A') {
		// 	throw new Error('it should have navigated to B');
		// }
		// let historyLength = await page.evaluate(() => window.history.length);
		// if (historyLength !== 3) {
		// 	throw new Error('it should have added a history item');
		// }
		// let location = new URL(page.url());
		// if (location.pathname !== '/b') {
		// 	throw new Error('it should have updated the browser location');
		// }
	});
});
