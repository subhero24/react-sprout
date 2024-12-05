import { Form, useLoaderResult } from '../../../source/index.js';
import Routes from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route() {
	let data = useLoaderResult();

	return (
		<>
			<Form method="post" sticky="transition">
				<button>Submit</button>
			</Form>
			<div id="count">{data}</div>
		</>
	);
}

let actionCount = 0;
async function action() {
	return actionCount++;
}

let loaderCount = 0;
async function loader() {
	let count = loaderCount++;
	await sleep(actionCount % 2 === 1 ? 1000 : 200);
	return count;
}

let Router = Routes(<Route action={action} loader={loader} />);

export default Router;
