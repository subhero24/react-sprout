import Routes, { useLoader, useRouter } from '../../../source/index.js';

import sleep from '../../utilities/sleep.js';

function Parent() {
	let data = useLoader();
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
	await sleep(250);
	return number++;
}

let Router = Routes(<Parent path="route" loader={parentLoader} />);

export default Router;
