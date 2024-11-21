import { useRef } from 'react';
import Routes, { Form } from '../../../source/index.js';

function RouteA() {
	let ref = useRef();

	function handleClick() {
		ref.current.requestSubmit();
	}

	return (
		<>
			<Form ref={ref} action="/b">
				<input type="hidden" name="x" value="y" />
			</Form>
			<button onClick={handleClick}>Navigate</button>
		</>
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
