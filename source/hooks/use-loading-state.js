import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import useImmutableCallback from './use-immutable-callback.js';

export function useLoadingState(options = {}) {
	let { delayLoadingMs = 200, minimumLoadingMs = 500, initial = false, value, onStart, onFinish } = options;

	let timerRef = useRef();
	let stampRef = useRef();
	let [loading, setLoading] = useState(value ?? initial);

	let start = useImmutableCallback((immediate = false) => {
		if (loading === false) {
			if (immediate || delayLoadingMs <= 0) {
				setLoading(true);
			} else if (timerRef.current == undefined) {
				timerRef.current = setTimeout(() => {
					setLoading(true);
				}, delayLoadingMs);
			}
		} else if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = undefined;
		}
	});

	let stop = useImmutableCallback((immediate = false) => {
		if (loading) {
			if (immediate || minimumLoadingMs <= 0) {
				setLoading(false);
			} else if (timerRef.current == undefined) {
				let now = Date.now();
				let stamp = stampRef.current;
				let extend = stamp - now + minimumLoadingMs;
				if (extend <= 0) {
					setLoading(false);
				} else {
					timerRef.current = setTimeout(() => {
						setLoading(false);
					}, extend);
				}
			}
		} else if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = undefined;
		}
	});

	useLayoutEffect(() => {
		if (value == undefined) return;
		if (value) {
			start();
		} else {
			stop();
		}
	}, [value, start, stop]);

	useEffect(() => {
		clearTimeout(timerRef.current);
		timerRef.current = undefined;
		stampRef.current = loading ? Date.now() : undefined;

		if (loading) {
			onStart?.();
		} else {
			onFinish?.();
		}
	}, [loading, onStart, onFinish]);

	return [loading, start, stop];
}

export function useCallbackLoadingState(func, options) {
	let idRef = useRef(0);
	let [loading, start, stop] = useLoadingState(options);

	let callback = useImmutableCallback(async (...args) => {
		let id = ++idRef.current;

		start();

		try {
			return await func(...args);
		} finally {
			if (id === idRef.current) {
				await stop();
			}
		}
	});

	return [callback, loading];
}

export function useCallbackBusyState(func) {
	let [busy, setBusy] = useState(false);

	let callback = useImmutableCallback(async (...args) => {
		setBusy(true);
		try {
			return await func(...args);
		} finally {
			setBusy(false);
		}
	});

	return [callback, busy];
}

export function useCallbackState(func, options) {
	let [callback1, busy] = useCallbackBusyState(func);
	let [callback2, loading] = useCallbackLoadingState(callback1, options);

	return [callback2, busy, loading];
}
