import Routes, { useParams } from '../../../../source/index.js';

function Route() {
	let params = useParams();

	return JSON.stringify(params);
}

let Router = Routes(<Route path=":name" />);

export default Router;
