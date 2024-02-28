import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('history state update function', async () => {
	await setup(currentDirectory, '/a', async function ({ page }) {
		await Promise.all([page.click('button'), page.waitForNavigation()]);

		let historyState = await page.evaluate('window.history.state');
		let historyStateString = JSON.stringify(historyState);
		if (historyStateString !== '{"y":2}') {
			throw new Error('it should have updated the state with the state update function and the action result');
		}
	});
});
