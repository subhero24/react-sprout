import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('params', async () => {
	await setup(currentDirectory, '/value', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== '{"name":"value"}') {
			throw new Error('it should have been passed the correct params');
		}
	});
});
