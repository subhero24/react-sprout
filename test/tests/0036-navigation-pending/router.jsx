import Routes, { Link, useLoader, useNavigations } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

let routeA = 0;
async function routeALoader() {
	await sleep(300);

	return ++routeA;
}

function RouteA() {
	let data = useLoader();
	let navigations = useNavigations();

	let loading = navigations[0]?.loading;
	let loadingElement;
	if (loading != undefined) {
		loadingElement = <div id="loading">{loading ? 'true' : 'false'}</div>;
	}

	return (
		<div>
			<h1>A</h1>
			<div>
				<Link href="/b" sticky>
					Navigate to B
				</Link>
			</div>
			{loadingElement}
		</div>
	);
}

let routeB = 0;
async function routeBLoader() {
	await sleep(300);

	return ++routeB;
}

function RouteB() {
	let data = useLoader();
	let navigations = useNavigations();

	return (
		<div>
			<h1>B</h1>
			<div id="navigations">{navigations.length}</div>
		</div>
	);
}

let Router = Routes(
	<>
		<RouteA path="a" loader={routeALoader} />
		<RouteB path="b" loader={routeBLoader} />
	</>,
);

export default Router;
