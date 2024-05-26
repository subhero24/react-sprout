import { useLayoutEffect, useRef, useState } from 'react';
import useImmutableCallback from './use-immutable-callback';

export default function useStateWithCallback(initialState) {
	let stateRef = useRef();
	let callbackRef = useRef();
	let [state, setState] = useState(initialState);

	useLayoutEffect(() => {
		if (state === stateRef.current) {
			callbackRef.current?.();
		}
	}, [state]);

	let setStateWithCallback = useImmutableCallback((newState, callback) => {
		if (typeof newState === 'function') {
			newState = newState(state);
		}

		setState(newState);

		stateRef.current = newState;
		callbackRef.current = callback;
	});

	return [state, setStateWithCallback];
}
