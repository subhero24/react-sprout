import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('history length', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await Promise.all([page.click('a'), page.waitForNavigation()]);

		let historyLength = await page.$eval('#history-length', root => root.innerText);
		if (historyLength !== '3') {
			throw new Error('it should have rendered the correct history length');
		}
	});
});
