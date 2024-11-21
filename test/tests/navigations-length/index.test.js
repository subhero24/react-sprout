import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigations length', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('a');

		let navigationsJson = await page.$eval('#navigations', node => node.innerText);
		let navigations = JSON.parse(navigationsJson);
		if (navigations.length !== 1) {
			throw new Error(`A navigation should have busy`);
		}
	});
});
