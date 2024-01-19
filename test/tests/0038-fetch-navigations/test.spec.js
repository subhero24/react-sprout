import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('fetch navigation should execute action and reload', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.waitForSelector('#value');

		let valueBefore = await page.$eval('#value', node => node.innerText);
		if (valueBefore !== '0') {
			throw new Error('value before the action should be 0');
		}

		await page.click('button');

		await sleep();

		let valueAfter = await page.$eval('#value', node => node.innerText);
		if (valueAfter !== '1') {
			throw new Error('value after the action should be 1');
		}
	});
});
