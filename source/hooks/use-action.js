import { useContext, createContext } from 'react';

export let actionContext = createContext();

export default function useAction() {
	return useContext(actionContext);
}
