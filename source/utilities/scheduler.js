export function createScheduler(options) {
	let { delayLoadingMs = 0, minimumLoadingMs = 0 } = options ?? {};

	let timestamp = Date.now();

	return { timestamp, delayLoadingMs, minimumLoadingMs };
}

export function resetScheduler(scheduler, options = {}) {
	let { delayLoadingMs, minimumLoadingMs } = options;

	scheduler.timestamp = Date.now();
	scheduler.delayLoadingMs = delayLoadingMs ?? scheduler.delayLoadingMs;
	scheduler.minimumLoadingMs = minimumLoadingMs ?? scheduler.minimumLoadingMs;
}

export function awaitScheduler(scheduler) {
	return new Promise(resolve => {
		if (scheduler) {
			let { timestamp, delayLoadingMs, minimumLoadingMs } = scheduler;

			let now = Date.now();
			let diff = now - timestamp;
			if (diff <= delayLoadingMs || diff > delayLoadingMs + minimumLoadingMs) {
				resolve();
			} else {
				setTimeout(resolve, delayLoadingMs + minimumLoadingMs - diff);
			}
		} else {
			resolve();
		}
	});
}
