import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('back button', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('a');
		await navigationPromise;

		let backNavigationPromise = page.waitForNavigation();

		await page.goBack();
		await backNavigationPromise;

		let render = await page.$eval('#root', root => root.innerText);
		if (render !== 'Navigate to B') {
			throw new Error('it should have rendered the first page again');
		}
	});
});
