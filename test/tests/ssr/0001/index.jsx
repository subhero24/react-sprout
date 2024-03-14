import Application from './application.jsx';

import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.querySelector('#root'), <Application />);
