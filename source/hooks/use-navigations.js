import { useContext, createContext } from 'react';

export let navigationsContext = createContext([]);

export default function useNavigations() {
	return useContext(navigationsContext);
}
