import useMatch from './use-match.js';

export default function useSplat() {
	return useMatch()?.rest;
}
