import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('cache popstate', async () => {
	await setup(currentDirectory, '/parent/child-a', async function ({ page }) {
		let navigationPromise = page.waitForNavigation();

		await page.click('a[href="/parent/child-b"]');
		await navigationPromise;

		let popstatePromise = page.waitForNavigation();

		await page.goBack();
		await popstatePromise;

		let parentCount = await page.$eval('#parent', root => root.innerText);
		if (parentCount !== '1') {
			throw new Error('parent should have used the cached loader');
		}
		let childCount = await page.$eval('#child-a', root => root.innerText);
		if (childCount !== '1') {
			throw new Error('child should have used the cached loader');
		}
	});
});
