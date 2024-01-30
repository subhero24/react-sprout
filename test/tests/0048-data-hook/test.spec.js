import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('route data', async () => {
	await setup(currentDirectory, '/parent/child', async function ({ page }) {
		let parent = await page.$eval('#parent-data', root => root.innerText);
		if (parent !== `["parent","child"]`) {
			throw new Error('route did not have the data of all the routes');
		}

		let child = await page.$eval('#child-data', root => root.innerText);
		if (child !== `["child"]`) {
			throw new Error('route did not have the data');
		}
	});
});
