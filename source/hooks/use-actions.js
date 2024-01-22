import { useContext, createContext } from 'react';

export let actionsContext = createContext();

export default function useActions() {
	return useContext(actionsContext);
}
