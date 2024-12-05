import useRouteLoader from './use-route-loader.js';

export default function useLoaderResult() {
	let loader = useRouteLoader();
	let loaderResource = loader?.resource;
	if (loaderResource.status === 'busy') {
		throw loaderResource.suspense;
	} else if (loaderResource.status === 'error') {
		throw loaderResource.result;
	} else if (loaderResource.status === 'done') {
		return loaderResource.result;
	}
}
