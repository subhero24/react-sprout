import { createRoot } from 'react-dom/client';

import Root from '../../root.jsx';
import Router from './router.jsx';

let request = new Request('/b');

createRoot(document.getElementById('root')).render(
	<Root>
		<Router defaultRequest={request} />
	</Root>,
);
