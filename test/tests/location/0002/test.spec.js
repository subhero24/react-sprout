import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('components have the correct location from <Location>', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== '/other') {
			throw new Error('it should have rendered the <Location> location');
		}
	});
});
