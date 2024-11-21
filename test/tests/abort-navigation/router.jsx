import Routes, { useNavigations, useNavigate, useAbort } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

let Router = Routes(
	<>
		<Route action={action} />
	</>,
);

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
			<button id="navigate" onClick={handleNavigate}>
				Navigate
			</button>
			<button id="abort" onClick={handleAbort}>
				Abort
			</button>
			<div id="navigations">{navigations.length}</div>
		</>
	);
}

async function action() {
	await sleep(500);
}

export default Router;
