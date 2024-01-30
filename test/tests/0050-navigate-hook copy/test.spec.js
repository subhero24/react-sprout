import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('extending loading of navigate hook with multiple navigations', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.click('button');

		await sleep(1000);

		await page.click('button');

		await sleep(200);

		let render = await page.$eval('#loading', root => root.innerText);
		if (render !== 'true') {
			throw new Error('it should have extended loading ');
		}
	});
});
