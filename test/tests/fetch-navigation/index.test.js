import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('fetch navigation', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.waitForSelector('#value');

		let valueBefore = await page.$eval('#value', node => node.innerText);
		if (valueBefore !== '0') {
			throw new Error('value before the action should be 0');
		}

		await page.click('button');

		try {
			await page.waitForFunction(() => document.querySelector('#value').innerText === '1', { timeout: 100 });
		} catch (error) {
			throw new Error('value after the action should be 1');
		}
		return;
	});
});
