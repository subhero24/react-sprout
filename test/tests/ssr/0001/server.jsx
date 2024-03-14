import Application from './application.jsx';

import { Request } from '../../../../source/index.js';
import { renderToString, renderToPipeableStream } from 'react-dom/server';

export default function (request) {
	return renderToString(
		<Request defaultValue={request}>
			<Application />
		</Request>,
	);
}
