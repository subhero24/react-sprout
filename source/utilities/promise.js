export function createPromise(resolveResult, rejectResult) {
	let reject;
	let resolve;
	let promise = new Promise((resolveFn, rejectFn) => {
		reject = function (arg) {
			rejectFn(typeof arg === 'function' ? arg(rejectResult) : arg ?? rejectResult);
		};
		resolve = function (arg) {
			resolveFn(typeof arg === 'function' ? arg(resolveResult) : arg ?? resolveResult);
		};
	});

	promise.reject = reject;
	promise.resolve = resolve;

	return promise;
}

export const rejected = 'rejected';
export const fulfilled = 'fulfilled';
export function createSyncAsync(value, state = fulfilled) {
	return {
		value,
		state,
		then: function (onFulfilled, onRejected) {
			let isRejected = this.state === rejected;
			if (isRejected && onRejected == undefined) return this;

			let isFulfilled = this.state === fulfilled;
			if (isFulfilled) {
				let valueIsPromise = value instanceof Promise;
				if (valueIsPromise) {
					return createSyncAsync(value.then(onFulfilled, onRejected));
				}
			}

			let handler;
			if (isFulfilled) {
				handler = onFulfilled;
			} else if (isRejected) {
				handler = onRejected;
			}

			try {
				return createSyncAsync(handler(value));
			} catch (error) {
				return createSyncAsync(error, rejected);
			}
		},
		catch: function (onRejected) {
			let isFulfilled = this.state === fulfilled;
			if (isFulfilled) {
				let valueIsPromise = value instanceof Promise;
				if (valueIsPromise) {
					return createSyncAsync(value.catch(onRejected));
				} else {
					return this;
				}
			}

			let isRejected = this.state === rejected;
			if (isRejected) {
				try {
					return createSyncAsync(onRejected(value));
				} catch (error) {
					return createSyncAsync(error, rejected);
				}
			}
		},
		finally: function (onFinally) {
			let isFulfilled = this.state === fulfilled;
			if (isFulfilled) {
				let valueIsPromise = value instanceof Promise;
				if (valueIsPromise) {
					return createSyncAsync(value.finally(onFinally));
				}
			}

			try {
				onFinally();

				return this;
			} catch (error) {
				return createSyncAsync(error, rejected);
			}
		},
	};
}

export async function isResolved(promise) {
	let value = {};
	try {
		let result = await Promise.race([promise, value]);
		if (result === value) {
			return false;
		} else {
			return true;
		}
	} catch {
		return true;
	}
}
