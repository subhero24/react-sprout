import { createContext, useContext } from 'react';

export let optionMinimumLoadingContext = createContext(500);

export default function useOptionMinimumLoading() {
	return useContext(optionMinimumLoadingContext);
}
