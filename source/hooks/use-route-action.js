import { useContext, createContext } from 'react';

export let routeActionContext = createContext();

export default function useRouteAction() {
	return useContext(routeActionContext);
}
