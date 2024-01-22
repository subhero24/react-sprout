import useAction from './use-action.js';

export default function useActionResult() {
	let action = useAction();
	let actionResource = action?.resource;
	if (actionResource) {
		if (actionResource.status === 'busy') {
			throw actionResource.suspense;
		} else if (actionResource.status === 'done') {
			return actionResource.result;
		}
	}
}
