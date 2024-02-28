import Routes, { useLoaderResult } from '../../../../source/index.js';

function loader() {
	return new Response(JSON.stringify({ some: { json: 'value' } }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

function Route() {
	let data = useLoaderResult();

	console.log(data);

	return JSON.stringify(data);
}

let Router = Routes(<Route loader={loader} />);

export default Router;
