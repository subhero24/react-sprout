import Routes, { useNavigate } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route() {
	let [navigate, busy, loading, navigations] = useNavigate();

	function handleClick() {
		navigate({ method: 'POST' });
	}

	return (
		<>
			<button onClick={handleClick}>Click</button>
			<div id="navigations">{JSON.stringify(navigations.length)}</div>
			<div id="busy">{JSON.stringify(busy)}</div>
			<div id="loading">{JSON.stringify(loading)}</div>
		</>
	);
}

async function action() {
	return sleep(200);
}

let Router = Routes(<Route action={action} />);

export default Router;
