import Test from 'node:test';

import { fileURLToPath } from 'url';

import sleep from '../../utilities/sleep.js';
import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('reload sticky', async () => {
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
	});
});
