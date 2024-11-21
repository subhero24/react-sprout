import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigation loading', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('a');

		let navigationsBefore = JSON.parse(await page.$eval('#navigations', node => node.innerText));
		if (navigationsBefore[0].loading !== false) {
			throw new Error('navigations should respect delayLoadingMs');
		}

		await sleep(200);

		let navigationsAfter = JSON.parse(await page.$eval('#navigations', node => node.innerText));
		if (navigationsAfter[0].loading !== true) {
			throw new Error('navigations should respect delayLoadingMs');
		}
	});
});
