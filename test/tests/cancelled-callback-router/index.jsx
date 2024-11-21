import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import Root from '../../root.jsx';
import Router from './router.jsx';

function Application() {
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

createRoot(document.getElementById('root')).render(
	<Root>
		<Application />
	</Root>,
);
