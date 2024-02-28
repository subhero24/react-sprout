import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);

createRoot(root).render(<Router />);

export default root;
