import { useContext, createContext } from 'react';

import { GET } from '../constants.js';

export const defaultOptions = {
	delayLoadingMs: 30,
	minimumLoadingMs: 500,
	defaultFormMethod: GET,
};

export let optionsContext = createContext(defaultOptions);

export default function useOptions() {
	return useContext(optionsContext);
}
