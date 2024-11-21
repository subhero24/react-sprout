import Routes, { Link, useHistory } from '../../../source/index.js';

function Parent(props) {
	let history = useHistory();

	return (
		<>
			<div id="history-length">{history.length}</div>
			{props.children}
		</>
	);
}

function RouteA() {
	return (
		<Link href="/b" sticky>
			Navigate to B
		</Link>
	);
}

function RouteB() {
	return (
		<Link href="/a" sticky>
			Navigate to A
		</Link>
	);
}

let Router = Routes(
	<Parent>
		<RouteA path="a" />
		<RouteB path="b" />
	</Parent>,
);

export default Router;
