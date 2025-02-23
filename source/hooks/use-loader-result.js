import useRouteLoader from './use-route-loader.js';

export default function useLoaderResult() {
	let loader = useRouteLoader();
	if (loader == undefined) {
		throw new Error(`useLoaderResult was called for a route without a loader`);
	}

	let loaderResource = loader?.resource;
	if (loaderResource.status === 'busy') {
		throw loaderResource.suspense;
	} else if (loaderResource.status === 'error') {
		throw loaderResource.result;
	} else if (loaderResource.status === 'done') {
		return loaderResource.result;
	}
}
