import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('timings delay loading before', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await page.click('button');
		await sleep(250);

		let render = await page.$eval('#root', root => root.innerText);
		if (render === 'fallback') {
			throw new Error('it should not have suspended before delayLoadingMs');
		}
	});
});
