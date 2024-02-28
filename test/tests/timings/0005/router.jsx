import Routes, { useLoaderResult, useNavigate } from '../../../../source/index.js';
import sleep from '../../../utilities/sleep.js';

function RouteA() {
	let [navigate] = useNavigate();

	function handleClick() {
		navigate('/b', { method: 'post' });
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

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" loader={loader} action={action} />
	</>,
);

export default Router;
