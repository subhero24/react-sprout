import { useContext, createContext } from 'react';

export let pageActionContext = createContext();

export default function usePageAction() {
	return useContext(pageActionContext);
}
