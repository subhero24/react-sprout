import Routes from '../../../source/index.js';

function Parent(props) {
	return props.children;
}

function Child(props) {
	let { params } = props;

	return JSON.stringify(params);
}

let Router = Routes(
	<Parent path=":parent">
		<Child path=":child" />
	</Parent>,
);

export default Router;
