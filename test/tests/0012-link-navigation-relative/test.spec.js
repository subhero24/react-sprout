import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('navigate with a link with a relative url', async () => {
	await setup(currentDirectory, '/parent/child', async function ({ page }) {
		await Promise.all([page.click('a'), page.waitForNavigation()]);

		let location = new URL(page.url());
		if (location.pathname !== '/parent/other') {
			throw new Error('it should have updated the browser location to the relative url');
		}
	});
});
