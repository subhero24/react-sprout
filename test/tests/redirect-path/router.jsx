import Routes, { Redirect } from '../../../source/index.js';

function Child() {
	return 'B';
}

let Router = Routes(
	<>
		<Child path="b" />
		<Redirect path="a" to="b" />
	</>,
);

export default Router;
