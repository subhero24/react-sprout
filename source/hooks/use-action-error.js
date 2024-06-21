import useActions from './use-actions.js';

export default function useActionError() {
	let action = useActions();
	let actionResource = action?.resource;
	if (actionResource) {
		if (actionResource.status === 'busy') {
			throw actionResource.suspense;
		} else if (actionResource.status === 'error') {
			return actionResource.result;
		}
	}
}
