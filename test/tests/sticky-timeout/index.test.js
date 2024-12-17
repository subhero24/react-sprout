import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('sticky timeout', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.waitForSelector('a');
		await page.click('a');

		let promise1 = sleep(250);
		let promise2 = sleep(750);

		await promise1;

		let render1 = await page.$eval('#loading', loading => loading.innerText);
		if (render1 !== 'loading') {
			throw new Error('it should have been sticky in the beginning');
		}

		await promise2;

		let render2 = await page.$eval('#root', root => root.innerText);
		if (render2 !== 'fallback') {
			throw new Error('it should have been sticky in the beginning');
		}
	});
});
