import { awaitScheduler } from './scheduler.js';

import { fulfilled, rejected } from './promise.js';

// We use a seperate promise for suspense, as that always needs resolving
// but we would like to keep the original erroring promise around for data flow

export function createSyncResource(result, state = fulfilled) {
	let status;
	let promise;
	let scheduler;

	if (state === fulfilled) {
		status = 'done';
		promise = Promise.resolve(result);
	} else if (state === rejected) {
		status = 'error';
		promise = Promise.reject(result);
	}

	return {
		status,
		result,
		promise,
		suspense: promise,
		scheduler,
	};
}

export function createAsyncResource(promise, scheduler) {
	let resource = {
		status: 'busy',
		result: undefined,
		promise: undefined,
		suspense: undefined,
		scheduler,
	};

	resource.promise = promise.finally(() => awaitScheduler(resource.scheduler));
	resource.suspense = resource.promise.then(resolve, reject);

	function resolve(result) {
		resource.status = 'done';
		resource.result = result;
		return result;
	}

	function reject(error) {
		resource.status = 'error';
		resource.result = error;
		return error;
	}

	return resource;
}
