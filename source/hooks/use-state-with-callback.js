import { useInsertionEffect, useRef, useState } from 'react';
import useImmutableCallback from './use-immutable-callback';

export default function useStateWithCallback(initialState) {
	let callbackRef = useRef();
	let [state, setState] = useState(initialState);

	let setStateWithCallback = useImmutableCallback((newstate, callback) => {
		if (typeof newstate === 'function') newstate = newstate(state);

		if (state === newstate) {
			callback?.();
		} else {
			callbackRef.current = callback;
			setState(newstate);
		}
	});

	useInsertionEffect(() => {
		callbackRef.current?.();
		callbackRef.current = undefined;
	}, [state]);

	return [state, setStateWithCallback];
}
