import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigate with relative link', async () => {
	await setup(currentDirectory, '/parent/child', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.waitForSelector('a');
		await page.click('a');

		await navigationPromise;

		let location = new URL(page.url());
		if (location.pathname !== '/parent/other') {
			throw new Error('it should have updated the browser location to the relative url');
		}
	});
});
