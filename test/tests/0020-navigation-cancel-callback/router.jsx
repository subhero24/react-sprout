import { useState } from 'react';
import Routes, { Link } from '../../../source/index.js';

function RouteA() {
	let [canceled, setCanceled] = useState(false);

	function handleCanceled() {
		setCanceled(true);
	}

	function handleNavigate(event) {
		event.preventDefault();
	}

	let cancelElement;
	if (canceled) {
		cancelElement = <div id="cancel">Canceled</div>;
	}

	return (
		<>
			{cancelElement}
			<Link href="/b" onCanceled={handleCanceled} onNavigate={handleNavigate}>
				Navigate to B
			</Link>
		</>
	);
}

function RouteB() {
	return <Link href="/a">Navigate to A</Link>;
}

let Router = Routes(
	<>
		<RouteA path="a" />
		<RouteB path="b" />
	</>,
);

export default Router;
