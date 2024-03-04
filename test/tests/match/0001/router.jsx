import Routes from '../../../../source/index.js';

function ParentA(props) {
	return props.children;
}

function ParentB(props) {
	return props.children;
}

function ParentC(props) {
	return props.children;
}

function ChildA() {
	return 'A';
}

function ChildB() {
	return 'B';
}

function ChildC() {
	return 'C';
}

let Router = Routes(
	<>
		<ParentA path=":parentA">
			<ChildA path=":childA" />
		</ParentA>
		<ParentB path=":parentB">
			<ChildB path="child" />
		</ParentB>
		<ParentC path=":parentB">
			<ChildC path="child" />
		</ParentC>
	</>,
);

export default Router;
