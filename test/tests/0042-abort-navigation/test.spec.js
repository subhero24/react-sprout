import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('aborting navigations', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('a');

		let navigationsBefore = await page.$eval('#navigations', node => node.innerText);
		if (navigationsBefore !== '1') {
			throw new Error('A navigation should have been busy');
		}

		await sleep(100);
		await page.click('button');

		let navigationsAfter = await page.$eval('#navigations', node => node.innerText);
		if (navigationsAfter !== '0') {
			throw new Error('The navigation should have been removed from navigations');
		}

		try {
			await page.waitForNavigation({ timeout: 500 });
		} catch (error) {
			return;
		}

		throw new Error('The navigation should have been aborted');
	});
});
