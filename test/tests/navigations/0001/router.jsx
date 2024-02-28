import Routes, { Link, useLoaderResult, useNavigations } from '../../../../source/index.js';
import sleep from '../../../utilities/sleep.js';

function RouteA() {
	let navigations = useNavigations();

	return (
		<>
			<Link href="/b" sticky>
				Navigate to B
			</Link>

			<div id="navigations">{JSON.stringify(navigations)}</div>
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
