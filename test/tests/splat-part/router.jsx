import Routes from '../../../source/index.js';

function Route(props) {
	let { splat } = props;

	return JSON.stringify(splat);
}

let Router = Routes(<Route path="a/*" />);

export default Router;
