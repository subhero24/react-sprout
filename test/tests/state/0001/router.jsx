import Routes, { Form } from '../../../../source/index.js';

function RouteA() {
	return (
		<Form action="/b" method="post" state={actionResult => ({ y: actionResult.x * 2 })}>
			<button>Navigate to b</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

async function action() {
	return { x: 1 };
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" action={action} />
	</>,
);

export default Router;
