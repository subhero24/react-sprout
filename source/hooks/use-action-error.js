import usePageAction from './use-page-action.js';

export default function useActionError() {
	let action = usePageAction();
	let actionResource = action?.resource;
	if (actionResource) {
		if (actionResource.status === 'busy') {
			throw actionResource.suspense;
		} else if (actionResource.status === 'error') {
			return actionResource.result;
		}
	}
}
