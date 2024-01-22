import { useContext, createContext } from 'react';

export let loaderContext = createContext();

export default function useLoader() {
	return useContext(loaderContext);
}
