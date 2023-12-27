import { useContext, createContext } from 'react';

export let baseContext = createContext('/');

export default function useBase() {
	return useContext(baseContext);
}
