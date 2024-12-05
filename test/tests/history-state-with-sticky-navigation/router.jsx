import Routes, { Link, useHistory } from '../../../source/index.js';

function Parent(props) {
	let history = useHistory();
	return (
		<>
			<div id="history-state">{history.state}</div>
			{props.children}
		</>
	);
}

function RouteA() {
	return (
		<Link href="/b" sticky="transition" state="b">
			Navigate to B
		</Link>
	);
}

function RouteB() {
	return (
		<Link href="/a" sticky="transition" state="a">
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
