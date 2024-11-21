import { Link } from '../../../source/index.js';
import Routes from '../../../source/index.js';

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
	</>,
);

function RouteA() {
	return <Link href="/b">Navigate to B</Link>;
}

function RouteB() {
	return <Link href="/a">Navigate to A</Link>;
}

export default Router;
