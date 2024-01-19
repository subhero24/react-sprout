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
		await page.waitForNavigation();

		let now = Date.now();
		let diff = now - time;
		if (diff >= 100) {
			throw new Error('navigations resolving before delayLoadingMs should not wait for minimumLoadingMs');
		}
	});
});
