import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('router reload should respect delayLoadingMs', async () => {
	await setup(currentDirectory, '/route', async function ({ page }) {
		let renderBefore = await page.$eval('#root', root => root.innerText);
		if (renderBefore !== 'fallback') {
			throw new Error('it should have suspended');
		}
		await page.waitForSelector('#count');
		let countBefore = await page.$eval('#count', count => count.innerText);
		if (countBefore !== '0') {
			throw new Error('it should have loaded the data');
		}
		await page.click('button');

		let renderInBetween = await page.$eval('#root', root => root.innerText);
		if (renderInBetween === 'fallback') {
			throw new Error('it should have respected the delayLoadingMs before transitioning');
		}

		await sleep(750);

		let renderAfter = await page.$eval('#root', root => root.innerText);
		if (renderAfter !== 'fallback') {
			throw new Error('it should not have loaded the data yet');
		}

		await page.waitForNavigation();

		let countAFter = await page.$eval('#count', count => count.innerText);
		if (countAFter !== '1') {
			throw new Error('it should have reloaded the data');
		}
	});
});
