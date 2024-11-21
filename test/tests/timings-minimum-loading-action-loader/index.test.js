import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('timings minimum loading action loader', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('button');

		await sleep(1500);

		let render = await page.$eval('#root', root => root.innerText);
		if (render !== 'fallback') {
			throw new Error('it should have used minimumLoadingMs for the loader');
		}
	});
});
