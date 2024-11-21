import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('reload minimal loading', async () => {
	await setup(currentDirectory, '/route', async function ({ page }) {
		await page.waitForSelector('button');
		await page.click('button');

		let now = Date.now();

		await page.waitForNavigation();

		let time = Date.now() - now;
		if (time < 750) {
			throw new Error('Loader should have respected the minimumLoadingMs on reload');
		}
	});
});
