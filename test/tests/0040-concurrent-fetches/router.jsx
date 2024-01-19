import { Suspense } from 'react';
import Routes, { Form, useLoader, useNavigations } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

let value = 0;
async function action() {
	await sleep(1000);

	value++;
}

async function loader() {
	return value;
}

function Parent(props) {
	let navigations = useNavigations();

	return (
		<>
			<Form method="post">
				<button name="intent" value="add">
					Add
				</button>
			</Form>
			<div id="navigations">{navigations.length}</div>
			<Suspense fallback="fallback">{props.children}</Suspense>
		</>
	);
}

function Child() {
	let data = useLoader();

	return <div id="value">{data}</div>;
}

let Router = Routes(
	<Parent action={action}>
		<Child loader={loader} />
	</Parent>,
);

export default Router;
