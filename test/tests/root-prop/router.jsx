import Routes, { Link } from '../../../source/index.js';

function Parent(props) {
	return props.children;
}

function Child() {
	return <Link href="/other">Navigate to /other</Link>;
}

let Router = Routes(
	<Parent path="parent" root>
		<Child path="child" />
	</Parent>,
);

export default Router;
