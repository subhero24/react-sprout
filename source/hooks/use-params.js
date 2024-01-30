import useMatch from './use-match.js';

export default function useParams() {
	return useMatch()?.params ?? {};
}
