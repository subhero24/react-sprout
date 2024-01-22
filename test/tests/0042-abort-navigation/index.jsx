import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';
import { Suspense } from 'react';

let root = appendChild(document.body, <div id="root" />);

createRoot(root).render(
	<Suspense fallback="fallback">
		<Router delayLoadingMs={2000} />
	</Suspense>,
);

export default root;
