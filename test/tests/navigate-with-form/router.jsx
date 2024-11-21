import Routes, { Form } from '../../../source/index.js';

function RouteA() {
	return (
		<Form action="/b">
			<input type="hidden" name="x" value="y" />
			<button>Submit</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
	</>,
);

export default Router;
