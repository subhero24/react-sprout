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
