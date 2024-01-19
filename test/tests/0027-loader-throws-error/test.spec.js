import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('loader throwing an error should invoke an error boundary', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== 'message') {
			throw new Error(`Error boundary should have been rendered`);
		}
	});
});
