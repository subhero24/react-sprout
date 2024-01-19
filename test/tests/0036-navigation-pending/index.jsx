import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);

createRoot(root).render(
	<Suspense fallback="fallback">
		<Router delayLoadingMs={100} minimumLoadingMs={1000} />
	</Suspense>,
);

export default root;
