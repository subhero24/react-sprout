import { createContext, useContext } from 'react';
import { nativeHistory } from '../utilities/history.js';

export let historyContext = createContext(nativeHistory);

export default function useHistory() {
	return useContext(historyContext);
}
