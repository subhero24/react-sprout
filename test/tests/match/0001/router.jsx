import Routes from '../../../../source/index.js';

function ParentA(props) {
	return props.children;
}

function ParentB(props) {
	return props.children;
}

function ChildA() {
	return 'A';
}

function ChildB() {
	return 'B';
}

let Router = Routes(
	<>
		<ParentA path=":parentA">
			<ChildA path=":child" />
		</ParentA>
		<ParentB path=":parentB">
			<ChildB path="child" />
		</ParentB>
	</>,
);

export default Router;
