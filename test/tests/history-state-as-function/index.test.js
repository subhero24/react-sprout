import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('history state as function', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('button');
		await navigationPromise;

		let historyState = await page.evaluate('window.history.state');
		if (historyState !== 42) {
			throw new Error('it should have updated the state');
		}
	});
});
