import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('render the route matching the context request', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'route') {
			throw new Error('it should have rendered the route with the matching path');
		}
	});
});
