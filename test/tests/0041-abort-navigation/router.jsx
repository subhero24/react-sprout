import Routes, { Link, useLoaderResult, useRouter } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function RouteA() {
	let { abort } = useRouter();

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
