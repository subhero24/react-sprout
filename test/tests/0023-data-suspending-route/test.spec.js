import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('the route suspends', async () => {
	await setup(currentDirectory, '/route', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'fallback') {
			throw new Error('it should have rendered the suspense fallback');
		}
	});
});
