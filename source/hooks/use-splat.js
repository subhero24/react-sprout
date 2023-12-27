import { useContext, createContext } from 'react';

export let splatContext = createContext();

export default function useSplat() {
	let splat = useContext(splatContext);
	if (splat == undefined) {
		throw new Error('The "useSplat" hook must be used inside a <Router> component.');
	}
	return splat;
}
