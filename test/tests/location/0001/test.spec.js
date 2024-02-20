import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('components have the correct location with useLocation', async () => {
	await setup(currentDirectory, '/a/b/c', async function ({ page }) {
		let pathname = await page.$eval('#root', root => root.innerText);
		if (pathname !== '/a/b/c') {
			throw new Error('it should have rendered the correct location pathname');
		}
	});
});
