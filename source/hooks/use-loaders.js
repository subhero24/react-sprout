import { useContext, createContext } from 'react';

export let loadersContext = createContext([]);

export default function useLoaders() {
	return useContext(loadersContext);
}
