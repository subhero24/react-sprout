import useLoader from './use-loader.js';
import useResource from './use-resource.js';

export default function useLoaderResult() {
	let loader = useLoader();
	let loaderResource = loader?.resource;

	return useResource(loaderResource);
}
