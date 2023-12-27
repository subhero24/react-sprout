import { useRef, useEffect } from 'react';

export default function usePreviousValue(value) {
	let old = useRef();
	let prev = useRef();

	useEffect(() => {
		old.current = prev.current;
		prev.current = value;
	}, [value]);

	if (value === prev.current) {
		return old.current;
	} else {
		return prev.current;
	}
}
