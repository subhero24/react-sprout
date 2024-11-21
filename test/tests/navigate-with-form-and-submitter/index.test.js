import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigate with form and submitter', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.waitForSelector('button');
		await page.click('button');

		await navigationPromise;

		let location = new URL(page.url());
		if (location.pathname !== '/c' || location.search !== '?x=y') {
			throw new Error('it should have updated the browser location');
		}
	});
});