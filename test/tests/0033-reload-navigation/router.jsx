import Routes, { Link, useLoaderResult, useNavigations } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route(props) {
	let data = useLoaderResult();
	let navigations = useNavigations();

	return (
		<div>
			<div id="navigations">{navigations.length}</div>
			<Link reload sticky>
				Reload
			</Link>
		</div>
	);
}

let value = 0;

async function loader() {
	await sleep(500);
	return ++value;
}

let Router = Routes(<Route loader={loader} />);

export default Router;
