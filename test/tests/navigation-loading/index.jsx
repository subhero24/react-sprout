import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Root from '../../root.jsx';
import Router from './router.jsx';

createRoot(document.getElementById('root')).render(
	<Root>
		<Suspense fallback="fallback">
			<Router delayLoadingMs={100} />
		</Suspense>
	</Root>,
);
