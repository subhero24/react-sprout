import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('onActionError callback', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let error = await page.$eval('#error', node => node.innerText);
		if (error !== 'Something went wrong') {
			throw new Error('The error state should have been set');
		}
	});
});
