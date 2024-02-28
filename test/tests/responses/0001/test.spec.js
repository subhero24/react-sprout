import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('returning an ok response from a loader', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== '{"some":{"json":"value"}}') {
			throw new Error('iit should have used the response data');
		}
	});
});
