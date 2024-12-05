import { useContext, createContext } from 'react';

export let routeLoaderContext = createContext();

export default function useRouteLoader() {
	return useContext(routeLoaderContext);
}
