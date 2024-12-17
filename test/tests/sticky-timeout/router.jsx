import Routes, { useLink, useLoaderResult, useNavigate } from '../../../source/index.js';

import sleep from '../../utilities/sleep.js';

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" loader={loader} />
	</>,
);

function RouteA() {
	let [Link, busy, loading] = useLink();

	return (
		<>
			<h1>A</h1>
			<div id="loading">{loading ? 'loading' : ''}</div>
			<Link href="/b" sticky={500}>
				Navigate to B
			</Link>
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

async function loader() {
	await sleep(1000);

	return 'B';
}

export default Router;
