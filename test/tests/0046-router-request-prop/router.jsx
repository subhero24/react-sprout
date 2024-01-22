import Routes from '../../../source/index.js';

function ChildA() {
	return 'child A';
}

function ChildB() {
	return 'child B';
}

let Router = Routes(
	<>
		<ChildA path="a" />
		<ChildB path="b" />
	</>,
);

export default Router;
