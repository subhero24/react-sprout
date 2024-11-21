import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('form reset', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.type('#text', 'text');

		let navigationPromise = page.waitForNavigation();

		await page.click('button');
		await navigationPromise;

		let value = await page.$eval('#text', input => input.value);
		if (value !== '') {
			throw new Error(`it should have reset the form`);
		}
	});
});
