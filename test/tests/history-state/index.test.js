import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('history state', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('button');
		await navigationPromise;

		let historyState = await page.evaluate('window.history.state');
		if (historyState !== 'state') {
			throw new Error('it should have updated the state');
		}
	});
});
