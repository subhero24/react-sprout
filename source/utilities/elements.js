import { createElement } from 'react';

import Route from '../components/route.jsx';

export function createElements(match) {
	if (match) {
		return createElement(Route, { match }, createElements(match.children));
	}
}
