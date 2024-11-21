import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';
import sleep from '../../utilities/sleep.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('concurrent navigations', async () => {
	await setup(currentDirectory, '/', async function ({ page }) {
		await page.waitForSelector('#value');
		await page.click('button');

		{
			let value = await page.$eval('#value', node => node.innerText);
			if (value !== '0') {
				throw new Error('A navigation action ended too soon');
			}

			let navigations = await page.$eval('#navigations', node => node.innerText);
			if (navigations !== '1') {
				throw new Error('A navigation should have been busy');
			}
		}

		await sleep(500);
		await page.click('button');

		{
			let value = await page.$eval('#value', node => node.innerText);
			if (value !== '0') {
				throw new Error('A navigation action ended too soon');
			}

			let navigations = await page.$eval('#navigations', node => node.innerText);
			if (navigations !== '2') {
				throw new Error('Two navigations should have been busy');
			}
		}

		await sleep(500);

		{
			let value = await page.$eval('#value', node => node.innerText);
			if (value !== '1') {
				throw new Error('A navigation action should have ended');
			}

			let navigations = await page.$eval('#navigations', node => node.innerText);
			if (navigations !== '1') {
				throw new Error('A navigation should have been ended');
			}
		}

		await sleep(500);

		{
			let value = await page.$eval('#value', node => node.innerText);
			if (value !== '2') {
				throw new Error('The other navigation action should have ended');
			}

			let navigations = await page.$eval('#navigations', node => node.innerText);
			if (navigations !== '0') {
				throw new Error('Both navigations should have been ended');
			}
		}
	});
});
