import { awaitScheduler } from './scheduler.js';

export function createResource(value, scheduler) {
	// We use a seperate promise for suspense, as that always needs resolving
	// but we would like to keep the original erroring promise around for data flow

	let resource = {
		status: 'busy',
		result: undefined,
		promise: undefined,
		suspense: undefined,
		scheduler,
	};

	let isPromise = value instanceof Promise;
	if (isPromise === false) {
		let promise = Promise.resolve(value);

		resource.status = 'done';
		resource.result = value;
		resource.promise = promise;
		resource.suspense = promise;
	} else {
		resource.promise = value.then(
			result =>
				awaitScheduler(resource.scheduler).then(() => {
					return result;
				}),
			error =>
				awaitScheduler(resource.scheduler).then(() => {
					throw error;
				}),
		);

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

		resource.suspense = resource.promise.then(resolve, reject);
	}

	return resource;
}
