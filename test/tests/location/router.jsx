import Routes, { useLocation } from '../../../source/index.js';

function Route() {
	let location = useLocation();
	console.log(location);
	return location.pathname;
}

let Router = Routes(<Route />);

export default Router;
