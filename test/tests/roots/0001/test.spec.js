import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('root routes', async () => {
	await setup(currentDirectory, '/root/a', async function ({ page }) {
		await Promise.all([page.click('a'), page.waitForNavigation()]);

		let url = new URL(page.url());
		if (url.pathname !== '/root/b') {
			throw new Error('it should have respected the root property');
		}
	});
});
