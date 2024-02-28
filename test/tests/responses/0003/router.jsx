import Routes, { Form } from '../../../../source/index.js';

function RouteA() {
	function handleError(event, error) {
		console.warn(error);
	}

	return (
		<Form action="/b" method="post" onError={handleError}>
			<button>Navigate to b</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

async function action() {
	throw new Error('test');
	return new Response(JSON.stringify({ some: { error: 'value' } }), {
		status: 400,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" action={action} />
	</>,
);

export default Router;
