import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('components have the correct location from a relative <Location>', async () => {
	await setup(currentDirectory, '/parent', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== '/parent/other') {
			throw new Error('it should have rendered the relative <Location> location');
		}
	});
});
