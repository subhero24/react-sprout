import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('returning a redirect from the action', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await Promise.all([page.click('button'), page.waitForNavigation()]);
		let render = await page.$eval('#root', root => root.innerHTML);
		if (render !== 'c') {
			throw new Error('it should have redirected');
		}
	});
});
