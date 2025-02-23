import { useLayoutEffect, useRef, useState } from 'react';
import useImmutableCallback from './use-immutable-callback';

export default function useStateWithCallback(initialState) {
	let callbacksRef = useRef([]);

	let [state, setState] = useState(initialState);

	useLayoutEffect(() => {
		callbacksRef.current.map(callback => callback());
		callbacksRef.current = [];
	});

	let setStateWithCallback = useImmutableCallback((newState, callback) => {
		setState(newState);

		if (callback) {
			if (typeof newState === 'function') {
				callbacksRef.current.push(callback);
			} else {
				callbacksRef.current = [callback];
			}
		}
	});

	return [state, setStateWithCallback];
}
