import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('splat', async () => {
	await setup(currentDirectory, '/a/b/c', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== '["a","b","c"]') {
			throw new Error('it should have been passed the correct splat');
		}
	});
});
