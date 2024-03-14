import { renderToString, renderToPipeableStream } from 'react-dom/server';

import Application from './application.jsx';

export default function (request, response) {
	return renderToString(<Application />);

	// const { pipe } = renderToPipeableStream(<Application />, {
	// 	bootstrapScripts: ['/client.js'],
	// 	onShellReady() {
	// 		response.setHeader('content-type', 'text/html');
	// 		pipe(response);
	// 	},
	// });
}
