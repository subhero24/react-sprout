import { useContext, createContext } from 'react';

export let paramsContext = createContext();

export default function useParams() {
	let params = useContext(paramsContext);
	if (params == undefined) {
		console.warn('The "useParams" hook must be used inside a <Router> component.');
	}
	return params ?? {};
}
