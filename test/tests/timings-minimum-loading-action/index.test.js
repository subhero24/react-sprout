import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('timings minimum loading action', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('button');

		await sleep(500);

		let render = await page.$eval('h1', root => root.innerText);
		if (render !== 'A') {
			throw new Error('it should have used minimumLoadingMs for the action');
		}
	});
});
