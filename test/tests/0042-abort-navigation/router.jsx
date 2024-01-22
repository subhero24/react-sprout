import Routes, { Link, useLoaderResult, useRouter, useNavigations } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function RouteA() {
	let router = useRouter();
	let navigations = useNavigations();

	function handleAbort() {
		router.abort();
	}

	return (
		<>
			<Link href="/b" sticky>
				Navigate to B
			</Link>
			<button onClick={handleAbort}>Abort</button>
			<div id="navigations">{navigations.length}</div>
		</>
	);
}

async function loader() {
	await sleep(300);
}

function RouteB() {
	let data = useLoaderResult();

	return 'b';
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" loader={loader} />
	</>,
);

export default Router;
