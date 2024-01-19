import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';
import { Suspense } from 'react';

let root = appendChild(document.body, <div id="root" />);

createRoot(root).render(
	<Suspense fallback={<div id="fallback">fallback</div>}>
		<Router delayLoadingMs={0} />
	</Suspense>,
);

export default root;
