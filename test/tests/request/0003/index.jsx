import { createRoot } from 'react-dom/client';
import { Request as RouterRequest } from '../../../../source/index.js';

import Router from './router.jsx';

import appendChild from '../../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);

function Root() {
	return (
		<RouterRequest value={new Request('/b')}>
			<Router />
		</RouterRequest>
	);
}

createRoot(root).render(<Root />);

export default root;
