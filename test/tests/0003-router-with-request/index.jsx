import { createRoot } from 'react-dom/client';

import Router from './router.jsx';

import appendChild from '../../utilities/dom/append-child.js';

let root = appendChild(document.body, <div id="root" />);
let request = new Request(new URL('/route', 'http://localhost:1337'));

createRoot(root).render(<Router request={request} />);

export default root;
