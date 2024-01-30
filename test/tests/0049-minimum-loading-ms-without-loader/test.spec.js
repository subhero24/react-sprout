import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigating with action but without loader', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.click('button');

		await sleep(800);

		let render = await page.$eval('#loading', root => root.innerText);
		if (render !== 'true') {
			throw new Error('the navigation should respect minimumLoadingMs');
		}
	});
});
