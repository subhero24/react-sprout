import Routes, { Link, useLoaderResult } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

function Route(props) {
	let data = useLoaderResult();

	return (
		<div>
			<div id="value">{data}</div>
			<Link reload sticky>
				Reload
			</Link>
		</div>
	);
}

let value = 0;

async function loader() {
	await sleep(2000);
	return ++value;
}

let Router = Routes(<Route loader={loader} />);

export default Router;
