import { useForm, useLoaderResult } from '../../../../source/index.js';
import Routes from '../../../../source/index.js';
import sleep from '../../../utilities/sleep.js';

function Route() {
	let data = useLoaderResult();

	let [Form, busy, loading, navigations] = useForm();

	return (
		<>
			<div>{navigations.length}</div>
			<Form method="post" sticky>
				<button name="intent" value="submit">
					Submit
				</button>
			</Form>
		</>
	);
}

let Router = Routes(<Route loader={loader} />);

async function loader() {
	console.log('woot');
	await sleep(2000);

	return 'test';
}

export default Router;
