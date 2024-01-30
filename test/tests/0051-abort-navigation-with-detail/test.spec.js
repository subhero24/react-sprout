import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('aborting navigations', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.click('button.navigate');
		await page.click('button.navigate');
		await page.click('button.navigate');

		let navigationsBefore = await page.$eval('#navigations', node => node.innerText);
		if (navigationsBefore !== '3') {
			throw new Error('Navigations should have been busy');
		}

		await sleep(100);
		await page.click('button.abort');

		let navigationsAfter = await page.$eval('#navigations', node => node.innerText);
		if (navigationsAfter !== '2') {
			throw new Error('A navigation should have been aborted');
		}
	});
});
