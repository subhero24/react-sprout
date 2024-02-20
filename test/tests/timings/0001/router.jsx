import { Suspense } from 'react';
import Routes, { useLoaderResult, useRouter, useNavigations } from '../../../../source/index.js';
import sleep from '../../../utilities/sleep.js';

function RouteA() {
	let router = useRouter();

	function handleClick() {
		router.navigate('b');
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

	return <h1>{data}</h1>;
}

async function loader() {
	await sleep(500);

	return 'B';
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" loader={loader} />
	</>,
);

export default Router;
