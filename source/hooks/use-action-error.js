import useAction from './use-action.js';

export default function useActionError() {
	let action = useAction();
	let actionResource = action?.resource;
	if (actionResource) {
		if (actionResource.status === 'busy') {
			throw actionResource.suspense;
		} else if (actionResource.status === 'error') {
			return actionResource.result;
		}
	}
}
