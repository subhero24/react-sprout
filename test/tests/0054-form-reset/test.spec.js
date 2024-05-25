import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('the back button should navigate back', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.type('#text', 'text');
		await Promise.all([page.click('button'), page.waitForNavigation()]);

		let value = await page.$eval('#text', input => input.value);
		if (value !== '') {
			throw new Error(`it should have reset the form`);
		}
	});
});
