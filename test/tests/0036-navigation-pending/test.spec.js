import Test from 'node:test';

import { fileURLToPath } from 'url';

import sleep from '../../utilities/sleep.js';
import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigation loading state', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.waitForSelector('a');

		let time = Date.now();

		await page.click('a');
		await sleep(200);

		let loading = await page.$eval('#loading', node => node?.innerText);
		if (loading !== 'true') {
			throw new Error('loading should be true after the delayLoadingMs timeout');
		}

		await page.waitForNavigation();

		let now = Date.now();
		let diff = now - time;
		if (diff < 1100) {
			throw new Error('navigation did not respect minimumLoadingMs');
		}
	});
});
