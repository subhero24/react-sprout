import { useMemo } from 'react';

import useMatch from './use-match.js';

export default function useMatches() {
	let match = useMatch();
	let matches = useMemo(() => {
		let currentMatch = match;
		if (currentMatch) {
			let result = [];
			while (currentMatch) {
				result.push(currentMatch);
				currentMatch = currentMatch.children;
			}
			return result;
		}
	}, [match]);

	return matches;
}
