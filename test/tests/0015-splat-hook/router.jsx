import Routes, { useSplat } from '../../../source/index.js';

function Route() {
	let splat = useSplat();

	return JSON.stringify(splat);
}

let Router = Routes(<Route />);

export default Router;
