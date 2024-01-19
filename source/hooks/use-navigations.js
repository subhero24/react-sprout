import { useContext, createContext } from 'react';

export let navigationsContext = createContext([]);

export default function useParams() {
	return useContext(navigationsContext);
}
