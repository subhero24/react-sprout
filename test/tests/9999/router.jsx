import { useMemo } from 'react';
import Routes, { Form, useForm, useLoaderResult, useNavigate } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function RouteA() {
	return (
		<>
			<Form method="post">
				<button name="intent" value="fetch">
					Submit
				</button>
			</Form>
		</>
	);
}

function RouteB() {
	return 'b';
}

async function action() {
	await sleep(2000);
	return Response.redirect('/b', 303);
}

async function loader() {
	await sleep(2000);
}

let Router = Routes(
	<>
		<RouteA path="a" action={action} loader={loader} />
		<RouteB path="b" />
	</>,
);

export default Router;
