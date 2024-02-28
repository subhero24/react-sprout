import Routes, { useLoaderResult, useNavigate } from '../../../source/index.js';

import sleep from '../../utilities/sleep.js';

function Parent() {
	let data = useLoaderResult();
	let [navigate] = useNavigate();

	function handleClick() {
		navigate({ reload: true });
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
