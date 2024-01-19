import { useContext, createContext } from 'react';

import useResource from './use-resource.js';

export let loaderContext = createContext();

export default function useLoader() {
	let loader = useContext(loaderContext);
	let loaderResource = loader?.resource;

	return useResource(loaderResource);
}
