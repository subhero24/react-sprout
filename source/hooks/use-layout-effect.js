import { useEffect, useLayoutEffect } from 'react';

let useIsomorphicEffect = typeof document == 'undefined' ? useEffect : useLayoutEffect;

export default function (handler, dependencies) {
	useIsomorphicEffect(handler, dependencies);
}
