import Routes, { useLoaderResult, useRouter, useNavigations } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function RouteA() {
	let router = useRouter();
	let navigations = useNavigations();

	function handleNavigate() {
		router.navigate('/b', { method: 'POST' });
	}

	function handleAbort() {
		router.abort();
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
