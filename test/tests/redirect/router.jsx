import Routes, { Redirect } from '../../../source/index.js';

let Router = Routes(
	<>
		<Child path="b" />
		<Redirect to="b" />
	</>,
);

function Child() {
	return 'B';
}

export default Router;
