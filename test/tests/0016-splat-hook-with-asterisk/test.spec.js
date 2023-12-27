import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('components have the correct splat with asterisked route', async () => {
	await setup(currentDirectory, '/a/b/c', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== '["b","c"]') {
			throw new Error('it should have been passed the correct splat');
		}
	});
});
