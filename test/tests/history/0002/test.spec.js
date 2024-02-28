import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('history state on sticky renders', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await Promise.all([page.click('a'), page.waitForNavigation()]);

		let historyState = await page.$eval('#history-state', root => root.innerText);
		if (historyState !== 'b') {
			throw new Error('it should have rendered the correct history state');
		}
	});
});
