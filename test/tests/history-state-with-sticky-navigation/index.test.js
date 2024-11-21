import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('history state with sticky navigation', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('a');
		await navigationPromise;

		let historyState = await page.$eval('#history-state', root => root.innerText);
		if (historyState !== 'b') {
			throw new Error('it should have rendered the correct history state');
		}
	});
});
