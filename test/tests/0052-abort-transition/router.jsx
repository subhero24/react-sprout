import Routes, { useLoaderResult, useNavigations, useNavigate, useAbort } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function RouteA() {
	let abort = useAbort();
	let [navigate] = useNavigate();
	let navigations = useNavigations();

	function handleNavigate() {
		navigate('/b', { method: 'POST' });
	}

	function handleAbort() {
		abort();
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

function RouteB() {
	return 'b';
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" action={action} />
	</>,
);

export default Router;
