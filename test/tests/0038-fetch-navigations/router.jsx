import Routes, { Form, useLoader } from '../../../source/index.js';

let value = 0;
async function action() {
	++value;
}

async function loader() {
	return value;
}

function Route() {
	let data = useLoader();

	return (
		<>
			<div id="value">{data}</div>
			<Form method="post">
				<button name="intent" value="add">
					Add
				</button>
			</Form>
		</>
	);
}

let Router = Routes(<Route action={action} loader={loader} />);

export default Router;
