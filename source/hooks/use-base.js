import useMatch from './use-match.js';

export default function useBase() {
	return useMatch()?.base ?? '/';
}
