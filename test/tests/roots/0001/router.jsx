import { Link } from '../../../../source/index.js';
import Routes from '../../../../source/index.js';

let Router = Routes(
	<Root path="root" root>
		<RouteA path="a" />
		<RouteB path="b" />
	</Root>,
);

function Root(props) {
	return props.children;
}

function RouteA() {
	return <Link href="/b">Navigate to B</Link>;
}

function RouteB() {
	return 'B';
}

export default Router;
