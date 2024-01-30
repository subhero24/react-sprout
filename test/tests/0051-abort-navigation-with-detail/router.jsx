import Routes, { Link, useLoaderResult, useRouter, useNavigations } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route() {
	let router = useRouter();
	let navigations = useNavigations();

	function handleNavigate() {
		router.navigate({ method: 'POST' });
	}

	function handleAbort() {
		router.abort(navigations[1]);
	}

	return (
		<>
			<button className="navigate" onClick={handleNavigate}>
				Navigate
			</button>
			<button className="abort" onClick={handleAbort}>
				Abort
			</button>
			<div id="navigations">{navigations.length}</div>
		</>
	);
}

async function action() {
	await sleep(500);
}

let Router = Routes(
	<>
		<Route action={action} />
	</>,
);

export default Router;
