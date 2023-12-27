import { createElement } from 'react';

import Route from '../components/route.jsx';

export function createElements(match) {
	if (match == undefined) return;

	let { config, base, rest, splat, params, children } = match;

	return createElement(Route, { config, base, rest, splat, params }, createElements(children));
}
