import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('aborting navigations', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('a');
		await sleep(100);
		await page.click('button');

		try {
			await page.waitForNavigation({ timeout: 500 });
		} catch (error) {
			return;
		}

		throw new Error('navigation should have been aborted');
	});
});
