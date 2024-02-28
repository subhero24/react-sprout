import Routes, { Form } from '../../../../source/index.js';

function RouteA() {
	function stateFn(data) {
		return data;
	}

	return (
		<Form action="/b" method="post" state={stateFn}>
			<button>Navigate to b</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

async function action() {
	return Response.json({ x: 1 });
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" action={action} />
	</>,
);

export default Router;
