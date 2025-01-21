import { createContext, useContext } from 'react';

export let baseContext = createContext('/');

export default function useBase() {
	return useContext(baseContext);
}
