import { useMemo } from 'react';

import useMatches from './use-matches.js';

export default function useData() {
	let matches = useMatches();
	let matchesData = useMemo(() => matches.map(match => match.config.data), [matches]);

	return matchesData;
}
