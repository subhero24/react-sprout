import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('loader suspense', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		let render = await page.$eval('#root', node => node.innerText);
		if (render !== 'suspense') {
			throw new Error('parent suspense should have been rendered');
		}
	});
});
