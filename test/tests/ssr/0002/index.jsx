import React from 'react';
import Application from './application.jsx';

import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document, React.createElement(Application));
