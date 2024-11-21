import { createRoot } from 'react-dom/client';
import { Request as RequestProvider } from '../../../source/index.js';

import Root from '../../root.jsx';
import Router from './router.jsx';

let request = new Request('/b');

createRoot(document.getElementById('root')).render(
	<Root>
		<RequestProvider defaultValue={request}>
			<Router />
		</RequestProvider>
	</Root>,
);
