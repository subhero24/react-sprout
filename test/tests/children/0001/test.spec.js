import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('parent routes have a children prop', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'child') {
			throw new Error('it should have rendered the child route');
		}
	});
});
