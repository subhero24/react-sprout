import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';
import sleep from '../../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('cancelling out of order responses', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.waitForSelector('button');
		page.click('button');
		page.click('button');
		await sleep(1500);

		let render = await page.$eval('#count', root => root.innerText);
		if (render !== '2') {
			throw new Error('it should have canceled the slower response with old data');
		}
	});
});
