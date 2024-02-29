import { useContext, createContext } from 'react';

export let requestContext = createContext([]);

export default function useRequest() {
	return useContext(requestContext);
}
