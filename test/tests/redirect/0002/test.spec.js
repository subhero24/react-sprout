import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('redirect route', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.waitForNavigation({ timeout: 1000 });

		let url = new URL(page.url());
		if (url.pathname !== '/b') {
			throw new Error('it should have redirected');
		}

		let render = await page.$eval('#root', root => root.innerText);
		if (render !== 'B') {
			throw new Error('it should have rendered the redirected route');
		}
	});
});
