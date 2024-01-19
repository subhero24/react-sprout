import Routes, { Link } from '../../../source/index.js';

function RouteA() {
	return (
		<Link href="/b" replace>
			Navigate to B
		</Link>
	);
}

function RouteB() {
	return (
		<Link href="/a" replace>
			Navigate to A
		</Link>
	);
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
	</>,
);

export default Router;
