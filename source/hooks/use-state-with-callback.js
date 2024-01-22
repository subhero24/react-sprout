import { useInsertionEffect, useRef, useState } from 'react';
import useImmutableCallback from './use-immutable-callback';

export default function useStateWithCallback(initialState) {
	let stateRef = useRef();
	let callbackRef = useRef();
	let [state, setState] = useState(initialState);

	let setStateWithCallback = useImmutableCallback((newState, callback) => {
		if (typeof newState === 'function') {
			newState = newState(state);
		}

		setState(newState);

		stateRef.current = newState;
		callbackRef.current = callback;
	});

	useInsertionEffect(() => {
		if (state === stateRef.current) {
			callbackRef.current?.();
		}
	}, [state]);

	return [state, setStateWithCallback];
}
