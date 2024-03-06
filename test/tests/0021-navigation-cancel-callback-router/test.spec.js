import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('link onCanceled callback is called', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('a');
		await page.waitForSelector('#cancel', { timeout: 500 });

		let location = new URL(page.url());
		if (location.pathname !== '/a') {
			throw new Error('it should have prevented the navigation');
		}
	});
});
