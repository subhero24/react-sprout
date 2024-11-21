import Routes, { Form } from '../../../source/index.js';

function RouteA() {
	return (
		<Form action="/b" method="post" state={action => action + 1}>
			<button>Navigate to b</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

function action() {
	return 41;
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" action={action} />
	</>,
);

export default Router;
