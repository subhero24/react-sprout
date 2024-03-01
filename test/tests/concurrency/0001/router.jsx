import { useForm, useLoaderResult, useNavigations } from '../../../../source/index.js';
import Routes from '../../../../source/index.js';
import sleep from '../../../utilities/sleep.js';

function Route() {
	let data = useLoaderResult();

	let navigations1 = useNavigations();
	let [Form, busy, loading, navigations2] = useForm();

	return (
		<>
			<Form method="post" sticky>
				<button>Submit</button>
			</Form>
			<div>{data}</div>
			<div>{JSON.stringify(navigations1)}</div>
			<div>{JSON.stringify(navigations2)}</div>
		</>
	);
}

let actionCount = 0;
async function action() {
	return actionCount++;
}

let Router = Routes(<Route action={action} loader={loader} />);

let loaderCount = 0;
async function loader() {
	let count = loaderCount++;
	await sleep(actionCount % 2 === 1 ? 4000 : 2000);

	console.log(count);

	return count;
}

export default Router;
