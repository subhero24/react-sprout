import Test from 'node:test';

import { fileURLToPath } from 'url';

import sleep from '../../utilities/sleep.js';
import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigation delay loading', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.waitForSelector('a');
		await page.click('a');

		let loadingBefore = await page.$eval('#loading', node => node?.innerText);
		if (loadingBefore !== 'false') {
			throw new Error('loading should be false before the delayLoadingMs timeout');
		}

		await sleep(100);

		let loadingAfter = await page.$eval('#loading', node => node?.innerText);
		if (loadingAfter !== 'true') {
			throw new Error('loading should be true after the delayLoadingMs timeout');
		}

		await page.waitForNavigation();

		let navigationLength = await page.$eval('#navigations', node => node?.innerText);
		if (navigationLength !== '0') {
			throw new Error('there should be no loading navigations');
		}
	});
});
