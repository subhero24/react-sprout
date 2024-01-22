import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('router request prop', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let error = await page.$eval('#root', node => node.innerText);
		if (error !== 'child B') {
			throw new Error('The router should have used the request prop');
		}
	});
});
