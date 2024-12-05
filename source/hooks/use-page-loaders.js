import { useContext, createContext } from 'react';

export let pageLoadersContext = createContext([]);

export default function usePageLoaders() {
	return useContext(pageLoadersContext);
}
