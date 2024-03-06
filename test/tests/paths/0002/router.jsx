import Routes from '../../../../source/index.js';

function Parent(props) {
	return props.children;
}

function Child() {
	return 'child';
}

let Router = Routes(
	<Parent path="a/b">
		<Child path="./" />
	</Parent>,
);

export default Router;
