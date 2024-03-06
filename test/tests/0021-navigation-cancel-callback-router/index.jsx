import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);

function Root() {
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
			<Router onNavigate={handleNavigate} onCanceled={handleCanceled} />
		</>
	);
}

createRoot(root).render(<Root />);

export default root;
