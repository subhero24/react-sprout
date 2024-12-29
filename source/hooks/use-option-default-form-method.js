import { createContext, useContext } from 'react';

export let optionDefaultFormMethodContext = createContext();

export default function useOptionDefaultFormMethod() {
	return useContext(optionDefaultFormMethodContext);
}
