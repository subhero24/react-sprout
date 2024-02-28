import Routes, { Link, useLoaderResult, useNavigations, useNavigate, useAbort } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route() {
	let abort = useAbort();
	let [navigate] = useNavigate();
	let navigations = useNavigations();

	function handleNavigate() {
		navigate({ method: 'POST' });
	}

	function handleAbort() {
		abort(navigations[1]);
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
