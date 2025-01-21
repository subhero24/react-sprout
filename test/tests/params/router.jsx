import Routes from '../../../source/index.js';

function Route(props) {
	let { params } = props;

	return JSON.stringify(params);
}

let Router = Routes(<Route path=":name" />);

export default Router;
