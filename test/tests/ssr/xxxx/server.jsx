import { renderToString, renderToPipeableStream } from 'react-dom/server';

import Application from './application.jsx';

export default function (request, response) {
	return renderToString(<Application />);
}
