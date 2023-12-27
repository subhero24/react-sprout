import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('components have the params of the parent', async () => {
	await setup(currentDirectory, '/parent/child', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== '{"parent":"parent","child":"child"}') {
			throw new Error('it should have the params of the parent');
		}
	});
});
