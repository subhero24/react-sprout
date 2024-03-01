import { useForm, useLoaderResult } from '../../../../source/index.js';
import Routes from '../../../../source/index.js';
import sleep from '../../../utilities/sleep.js';

function Route() {
	let data = useLoaderResult();

	let [Form, busy, loading, navigations] = useForm();

	return (
		<>
			<div>{data}</div>
			<div>{navigations.length}</div>
			<div>{JSON.stringify(navigations)}</div>
			<Form method="post" sticky>
				<button name="intent" value="submit">
					Submit
				</button>
			</Form>
		</>
	);
}

let Router = Routes(<Route loader={loader} />);

let count = 0;

async function loader() {
	await sleep(3000);

	return count++;
}

export default Router;
