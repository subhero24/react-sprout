import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);
let request = new Request('/b');

createRoot(root).render(
	<Suspense fallback="fallback">
		<Router request={request} />
	</Suspense>,
);

export default root;
