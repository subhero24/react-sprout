import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigate with replace link', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('a');
		await navigationPromise;

		let render = await page.$eval('#root', root => root.innerText);
		if (render !== 'Navigate to A') {
			throw new Error('it should have navigated to B');
		}

		let historyLength = await page.evaluate(() => window.history.length);
		if (historyLength !== 2) {
			throw new Error('it should not have added a history item');
		}

		let location = new URL(page.url());
		if (location.pathname !== '/b') {
			throw new Error('it should have updated the browser location');
		}
	});
});
