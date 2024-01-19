import { useRef, useEffect } from 'react';

export default function useMountedRef() {
	let mounted = useRef(false);

	useEffect(() => {
		mounted.current = true;

		return () => {
			mounted.current = false;
		};
	}, []);

	return mounted;
}
