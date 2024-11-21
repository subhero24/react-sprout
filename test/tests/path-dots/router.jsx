import Routes from '../../../source/index.js';

let Router = Routes(
	<Parent path="a/b/*/..">
		<Child path="z" />
	</Parent>,
);

function Parent(props) {
	return props.children;
}

function Child() {
	return 'child';
}

export default Router;
