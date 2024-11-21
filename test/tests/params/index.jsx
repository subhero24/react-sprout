import { createRoot } from 'react-dom/client';

import Root from '../../root.jsx';
import Router from './router.jsx';

createRoot(document.getElementById('root')).render(
	<Root>
		<Router />
	</Root>,
);
