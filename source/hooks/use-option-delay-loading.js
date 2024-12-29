import { createContext, useContext } from 'react';

export let optionDelayLoadingContext = createContext(30);

export default function useOptionDelayLoading() {
	return useContext(optionDelayLoadingContext);
}
