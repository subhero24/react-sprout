import { useRef, useEffect } from 'react';

export default function useLastValueRef(value) {
	let ref = useRef();

	useEffect(() => {
		ref.current = value;
	});

	return ref;
}
