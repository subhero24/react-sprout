import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Root from '../../root.jsx';
import Router from './router.jsx';

createRoot(document.getElementById('root')).render(
	<Root>
		<Suspense fallback="fallback">
			<Router delayLoadingMs={500} minimumLoadingMs={1000} />
		</Suspense>
	</Root>,
);
