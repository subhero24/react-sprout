import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('do not render the route with mismatching path', async () => {
	await setup(currentDirectory, '/other', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== '') {
			throw new Error('it should not have rendered the route');
		}
	});
});
