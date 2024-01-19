export default function useResource(resource) {
	if (resource) {
		if (resource.status === 'busy') {
			throw resource.suspense;
		} else if (resource.status === 'error') {
			throw resource.result;
		} else if (resource.status === 'done') {
			return resource.result;
		}
	}
}
