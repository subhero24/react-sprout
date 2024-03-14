import Application from './application.jsx';

import { Request } from '../../../../source/index.js';
import { renderToPipeableStream } from 'react-dom/server';

import scriptUrl from './index.jsx?url';

export default function (request, response) {
	const { pipe } = renderToPipeableStream(
		<Request defaultValue={request}>
			<Application />
		</Request>,
		{
			bootstrapScripts: [scriptUrl],
			onShellReady() {
				response.setHeader('content-type', 'text/html');
				pipe(response);
			},
		},
	);
}
