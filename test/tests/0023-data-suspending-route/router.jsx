import Routes, { useLoader } from '../../../source/index.js';

import sleep from '../../utilities/sleep.js';

function Route() {
	let data = useLoader();

	return data;
}

async function loader() {
	await sleep(5000);

	return 'data';
}

let Router = Routes(<Route path="route" loader={loader} />);

export default Router;
