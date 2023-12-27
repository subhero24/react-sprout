import Routes, { useLocation } from '../../../source/index.js';

function Route() {
	let location = useLocation();
	return location.pathname;
}

let Router = Routes(<Route path="route" />);

export default Router;
