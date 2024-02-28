import Routes, { Link, useLoaderResult, useAbort, useLink } from '../../../../source/index.js';

import sleep from '../../../utilities/sleep.js';

function RouteA() {
	let abort = useAbort();

	function handleAbort() {
		abort();
	}

	return (
		<>
			<Link href="/b" sticky>
				Navigate to B
			</Link>
			<button onClick={handleAbort}>Abort</button>
		</>
	);
}

async function loader() {
	await sleep(3000);

	return 'b';
}

function RouteB() {
	let data = useLoaderResult();

	return data;
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" loader={loader} />
	</>,
);

export default Router;
