import { useState } from 'react';
import Routes, { Form } from '../../../source/index.js';

function ChildA() {
	let [error, setError] = useState();

	function handleActionError(event, error) {
		setError(error.message);
	}

	return (
		<>
			<div id="error">{error}</div>
			<Form action="/b" method="post" onActionError={handleActionError}>
				<button name="name" value="value">
					Submit
				</button>
			</Form>
		</>
	);
}

function ChildB() {
	return 'child B';
}

async function action() {
	throw new Error('Something went wrong');
}

let Router = Routes(
	<>
		<ChildA path="a" />
		<ChildB path="b" action={action} />
	</>,
);

export default Router;
