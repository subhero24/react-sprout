import Test from 'node:test';

import { fileURLToPath } from 'url';

import sleep from '../../utilities/sleep.js';
import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('reload navigation', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.waitForSelector('#navigations');

		let value1 = await page.$eval('#navigations', node => node?.innerText);
		if (value1 !== '0') {
			throw new Error('there should be no current navigations before navigating');
		}

		await page.click('a');

		let value2 = await page.$eval('#navigations', node => node?.innerText);
		if (value2 !== '1') {
			throw new Error('the reload navigation should be pending');
		}

		await sleep(750);

		let value3 = await page.$eval('#navigations', node => node?.innerText);
		if (value3 !== '0') {
			throw new Error('the reload navigation should have been ended by now');
		}
	});
});
