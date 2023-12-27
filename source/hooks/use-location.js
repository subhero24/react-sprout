import { createContext, useContext } from 'react';
import { nativeDocument } from '../utilities/document.js';

export let locationContext = createContext(nativeDocument?.location);

export default function useLocation() {
	return useContext(locationContext);
}
