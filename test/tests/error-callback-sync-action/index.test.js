import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('error callback sync action', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('button');

		let error = await page.$eval('#error', node => node.innerText);
		if (error !== 'Something went wrong') {
			throw new Error('The onActionError callback should have been invoked');
		}
	});
});
