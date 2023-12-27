import { useContext, createContext } from 'react';

export let routerContext = createContext();

export default function useRouter() {
	return useContext(routerContext);
}
