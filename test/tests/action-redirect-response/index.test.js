import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('action redirect response', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('button');
		await navigationPromise;

		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'c') {
			throw new Error('it should have redirected');
		}
	});
});
