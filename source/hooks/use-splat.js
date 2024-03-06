import useMatch from './use-match.js';

export default function useSplat() {
	let match = useMatch();
	if (match) {
		return match.splat ?? match.rest;
	}
}
