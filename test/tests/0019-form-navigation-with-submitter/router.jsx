import Routes, { Form } from '../../../source/index.js';

function RouteA() {
	return (
		<Form action="b">
			<button name="x" value="y" formAction="c">
				Submit
			</button>
		</Form>
	);
}

function RouteB() {
	return 'b';
}

function RouteC() {
	return 'c';
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
		<RouteC path="c" />
	</>,
);

export default Router;
