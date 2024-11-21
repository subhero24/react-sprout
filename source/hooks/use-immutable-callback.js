import { useRef, useCallback, useInsertionEffect } from 'react';

export default function useImmutableCallback(callback, dependencies = []) {
	let callbackRef = useRef();

	useInsertionEffect(() => {
		callbackRef.current = callback;
	});

	return useCallback(
		function (...args) {
			return callbackRef.current?.(...args);
		},
		[callbackRef, ...dependencies], // eslint-disable-line react-hooks/exhaustive-deps
	);
}
