import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('cache loaders', async () => {
	await setup(currentDirectory, '/parent/child-a', async function ({ page }) {
		let navigationAPromise = page.waitForNavigation();

		await page.click('a[href="/parent/child-b"]');
		await navigationAPromise;

		let navigationBPromise = page.waitForNavigation();

		await page.click('a[href="/parent/child-a"]');
		await navigationBPromise;

		let parentCount = await page.$eval('#parent', root => root.innerText);
		if (parentCount !== '1') {
			throw new Error('parent should have used the cached loader');
		}

		await page.waitForSelector('#child-a');

		let childCount = await page.$eval('#child-a', root => root.innerText);
		if (childCount !== '2') {
			throw new Error('child should not have used the cached loader');
		}
	});
});
