import { useContext, createContext } from 'react';

export let matchContext = createContext();

export default function useMatch() {
	return useContext(matchContext);
}
