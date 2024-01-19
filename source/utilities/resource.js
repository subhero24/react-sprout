import { awaitScheduler } from './scheduler.js';

export function createResource(promise, scheduler) {
	let resource = {
		status: 'busy',
		result: undefined,
		promise: undefined,
		suspense: undefined,
		scheduler,
	};

	let resolve = function (result) {
		resource.status = 'done';
		resource.result = result;
		return result;
	};

	let reject = function (error) {
		resource.status = 'error';
		resource.result = error;
		return error;
	};

	resource.promise = promise.then(
		result =>
			awaitScheduler(resource.scheduler).then(() => {
				return result;
			}),
		error =>
			awaitScheduler(resource.scheduler).then(() => {
				throw error;
			}),
	);

	// We use a seperate promise for suspense, as that always needs resolving
	// but we would like to keep the original erroring promise around for data flow
	resource.suspense = resource.promise.then(resolve).catch(reject);

	return resource;
}
