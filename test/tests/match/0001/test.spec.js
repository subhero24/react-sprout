import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('parallel matching', async () => {
	await setup(currentDirectory, '/parent/child', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'B') {
			throw new Error('it should have matched the other routes');
		}
	});
});
