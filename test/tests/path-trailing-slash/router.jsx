import Routes from '../../../source/index.js';

let Router = Routes(
	<Parent path="a/b">
		<Child path="./" />
	</Parent>,
);

function Parent(props) {
	return props.children;
}

function Child() {
	return 'child';
}

export default Router;
