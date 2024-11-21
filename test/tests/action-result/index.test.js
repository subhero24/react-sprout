import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('action result', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('button');
		await navigationPromise;

		let actionParent = await page.$eval('#action-parent', node => node.innerText);
		if (actionParent !== '') {
			throw new Error('The parent should not have an action result');
		}

		let actionChild = await page.$eval('#action-child', node => node.innerText);
		if (actionChild !== 'action') {
			throw new Error('The child should have an action result');
		}
	});
});
