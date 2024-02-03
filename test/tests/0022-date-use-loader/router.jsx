import Routes, { useLoaderResult } from '../../../source/index.js';

function Route() {
	let data = useLoaderResult();

	return data;
}

async function loader() {
	return 'data';
}

let Router = Routes(<Route loader={loader} />);

export default Router;
