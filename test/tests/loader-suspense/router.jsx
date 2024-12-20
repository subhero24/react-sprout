import { Suspense } from 'react';
import Routes, { useLoaderResult } from '../../../source/index.js';
import sleep from '../../utilities/sleep.js';

let value = 0;

async function loader() {
	await sleep(200);

	return ++value;
}

function Parent(props) {
	return <Suspense fallback="suspense">{props.children}</Suspense>;
}

function Child() {
	let data = useLoaderResult();

	return <div id="value">{data}</div>;
}

let Router = Routes(
	<Parent>
		<Child loader={loader} />
	</Parent>,
);

export default Router;
