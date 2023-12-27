import { useContext, createContext } from 'react';

export let rootContext = createContext('/');

export default function useRoot() {
	return useContext(rootContext);
}
