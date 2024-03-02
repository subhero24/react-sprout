import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('the back button should navigate back', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await Promise.all([page.click('a'), page.waitForNavigation()]);
		await Promise.all([page.goBack(), page.waitForNavigation()]);

		let render2 = await page.$eval('#root', root => root.innerText);
		if (render2 !== 'Navigate to B') {
			throw new Error('it should have rendered the first page again');
		}
	});
});
