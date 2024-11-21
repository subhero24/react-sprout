import Routes, { useLoaderResult, useNavigate } from '../../../source/index.js';

import sleep from '../../utilities/sleep.js';

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" loader={loader} action={action} />
	</>,
);

function RouteA() {
	let [navigate] = useNavigate();

	function handleClick() {
		navigate('/b', { method: 'post', onActionError: (event, error) => console.error(error) });
	}

	return (
		<>
			<h1>A</h1>
			<button onClick={handleClick}>Navigate to B</button>
		</>
	);
}

function RouteB() {
	let data = useLoaderResult();

	return (
		<>
			<h1>{data}</h1>
		</>
	);
}

async function action() {
	await sleep(250);
}

async function loader() {
	await sleep(250);

	return 'B';
}

export default Router;
