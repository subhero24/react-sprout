import Routes, { Form } from '../../../source/index.js';

function RouteA() {
	return (
		<Form action="/b" method="post">
			<button>Navigate to b</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

function RouteC() {
	return 'c';
}

async function action() {
	return Response.redirect('/c', 303);
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" action={action} />
		<RouteC path="c" />
	</>,
);

export default Router;
