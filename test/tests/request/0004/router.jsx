import { Link } from '../../../../source/index.js';
import Routes from '../../../../source/index.js';

function RouteA() {
	return <Link href="/b">Navigate to B</Link>;
}

function RouteB() {
	return <Link href="/a">Navigate to A</Link>;
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
	</>,
);

export default Router;
