import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('match complex path', async () => {
	await setup(currentDirectory, '/a/b/z', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'child') {
			throw new Error('it should have matched');
		}

		await page.goto(new URL('/a/b/c/d/e/z', page.url()));

		let render2 = await page.$eval('#root', root => root.innerHTML);
		if (render2 !== 'child') {
			throw new Error('it should have matched');
		}
	});
});
