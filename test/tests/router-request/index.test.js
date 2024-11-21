import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('router request', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		let render = await page.$eval('#root', root => root.innerText);
		if (render !== 'Navigate to A') {
			throw new Error('it should have rendered the request from the router prop');
		}

		await page.click('a');
		await sleep(100);

		let renderAfter = await page.$eval('#root', root => root.innerText);
		if (renderAfter !== 'Navigate to A') {
			throw new Error('it should have ignored navigation in a controlled router');
		}

		let url = new URL(page.url());
		if (url.pathname !== '/a') {
			throw new Error('it should not have updated the browser in a non browser router');
		}
	});
});
