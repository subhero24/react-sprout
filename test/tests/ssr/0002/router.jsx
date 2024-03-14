import Routes from '../../../../source/index.js';

function RouteA() {
	return 'A';
}

function RouteB() {
	return 'B';
}

export default Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
	</>,
);
