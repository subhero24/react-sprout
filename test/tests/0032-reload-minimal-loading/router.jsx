import Routes, { useLoaderResult, useRouter } from '../../../source/index.js';

import sleep from '../../utilities/sleep.js';

function Parent() {
	let data = useLoaderResult();
	let router = useRouter();

	function handleClick() {
		router.reload();
	}

	return (
		<div>
			<span id="count">{data}</span>
			<button onClick={handleClick}>reload</button>
		</div>
	);
}

let number = 0;

async function parentLoader() {
	await sleep(300);
	return number++;
}

let Router = Routes(<Parent path="route" loader={parentLoader} />);

export default Router;
