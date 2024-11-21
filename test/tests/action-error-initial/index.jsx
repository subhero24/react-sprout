import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Root from '../../root.jsx';
import Router from './router.jsx';

let request = new Request('/b', { method: 'POST' });

createRoot(document.getElementById('root')).render(
	<Root>
		<Suspense fallback="fallback">
			<Router request={request} />
		</Suspense>
	</Root>,
);
