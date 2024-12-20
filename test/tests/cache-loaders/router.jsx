import Routes, { Link, useLoaderResult } from '../../../source/index.js';

let Router = Routes(
	<Parent path="parent" loader={parentLoader}>
		<ChildA path="child-a" loader={childALoader} />
		<ChildB path="child-b" loader={childBLoader} />
	</Parent>,
);

function Parent(props) {
	let parentCount = useLoaderResult();

	return (
		<div>
			<nav>
				<Link href="child-a">Navigate to A</Link>
				<Link href="child-b">Navigate to B</Link>
			</nav>
			<span id="parent">{parentCount}</span>
			{props.children}
		</div>
	);
}

let parent = 0;
function parentLoader() {
	return ++parent;
}

function ChildA() {
	let childACount = useLoaderResult();

	return <span id="child-a">{childACount}</span>;
}

let childA = 0;
function childALoader() {
	return ++childA;
}

function ChildB() {
	let childBCount = useLoaderResult();

	return <span id="child-b">{childBCount}</span>;
}

let childB = 0;
function childBLoader() {
	return ++childB;
}

export default Router;
