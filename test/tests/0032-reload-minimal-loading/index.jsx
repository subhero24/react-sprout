import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);

createRoot(root).render(
	<Suspense fallback="fallback">
		<Router delayLoadingMs={250} minimumLoadingMs={500} />
	</Suspense>,
);

export default root;
