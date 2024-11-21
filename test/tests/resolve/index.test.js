import Test from 'node:test';

import { fileURLToPath } from 'url';

import setup from '../../utilities/setup.js';

const currentDirectory = fileURLToPath(new URL('.', import.meta.url));

Test('resolve', async () => {
	await setup(currentDirectory, '/a/b/c', async function ({ page }) {
		{
			let render = await page.$eval('#a-relative-dot', element => element.innerText);
			if (render !== '/a') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-dot-slash', element => element.innerText);
			if (render !== '/a/') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-dot-part', element => element.innerText);
			if (render !== '/a/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-dots', element => element.innerText);
			if (render !== '/') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-dots-slash', element => element.innerText);
			if (render !== '/') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-dots-part', element => element.innerText);
			if (render !== '/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-dots-part-slash', element => element.innerText);
			if (render !== '/x/') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-absolute', element => element.innerText);
			if (render !== '/') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-absolute-part', element => element.innerText);
			if (render !== '/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-part', element => element.innerText);
			if (render !== '/a/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-relative-parts', element => element.innerText);
			if (render !== '/a/x/y') throw new Error();
		}
		{
			let render = await page.$eval('#a-dot', element => element.innerText);
			if (render !== '/a/b/c') throw new Error();
		}
		{
			let render = await page.$eval('#a-dot-slash', element => element.innerText);
			if (render !== '/a/b/c/') throw new Error();
		}
		{
			let render = await page.$eval('#a-dot-part', element => element.innerText);
			if (render !== '/a/b/c/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-dots', element => element.innerText);
			if (render !== '/a/b') throw new Error();
		}
		{
			let render = await page.$eval('#a-dots-slash', element => element.innerText);
			if (render !== '/a/b/') throw new Error();
		}
		{
			let render = await page.$eval('#a-dots-part', element => element.innerText);
			if (render !== '/a/b/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-dots-part-slash', element => element.innerText);
			if (render !== '/a/b/x/') throw new Error();
		}
		{
			let render = await page.$eval('#a-absolute', element => element.innerText);
			if (render !== '/') throw new Error();
		}
		{
			let render = await page.$eval('#a-absolute-part', element => element.innerText);
			if (render !== '/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-part', element => element.innerText);
			if (render !== '/a/b/c/x') throw new Error();
		}
		{
			let render = await page.$eval('#a-parts', element => element.innerText);
			if (render !== '/a/b/c/x/y') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dot', element => element.innerText);
			if (render !== '/a/b') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dot-slash', element => element.innerText);
			if (render !== '/a/b/') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dot-part', element => element.innerText);
			if (render !== '/a/b/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dots', element => element.innerText);
			if (render !== '/a') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dots-slash', element => element.innerText);
			if (render !== '/a/') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dots-part', element => element.innerText);
			if (render !== '/a/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-dots-part-slash', element => element.innerText);
			if (render !== '/a/x/') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-absolute', element => element.innerText);
			if (render !== '/') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-absolute-part', element => element.innerText);
			if (render !== '/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-part', element => element.innerText);
			if (render !== '/a/b/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-relative-parts', element => element.innerText);
			if (render !== '/a/b/x/y') throw new Error();
		}
		{
			let render = await page.$eval('#b-dot', element => element.innerText);
			if (render !== '/a/b/c') throw new Error();
		}
		{
			let render = await page.$eval('#b-dot-slash', element => element.innerText);
			if (render !== '/a/b/c/') throw new Error();
		}
		{
			let render = await page.$eval('#b-dot-part', element => element.innerText);
			if (render !== '/a/b/c/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-dots', element => element.innerText);
			if (render !== '/a/b') throw new Error();
		}
		{
			let render = await page.$eval('#b-dots-slash', element => element.innerText);
			if (render !== '/a/b/') throw new Error();
		}
		{
			let render = await page.$eval('#b-dots-part', element => element.innerText);
			if (render !== '/a/b/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-dots-part-slash', element => element.innerText);
			if (render !== '/a/b/x/') throw new Error();
		}
		{
			let render = await page.$eval('#b-absolute', element => element.innerText);
			if (render !== '/') throw new Error();
		}
		{
			let render = await page.$eval('#b-absolute-part', element => element.innerText);
			if (render !== '/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-part', element => element.innerText);
			if (render !== '/a/b/c/x') throw new Error();
		}
		{
			let render = await page.$eval('#b-parts', element => element.innerText);
			if (render !== '/a/b/c/x/y') throw new Error();
		}
	});
});
