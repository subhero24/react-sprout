import { useEffect, useMemo, useRef } from 'react';
import { useNavigations } from '..';
import useImmutableCallback from './use-immutable-callback';

export default function useNavigationsScope() {
	let navigations = useNavigations();

	let scopedRef = useRef([]);
	let scoped = useMemo(
		() => navigations.filter(navigation => scopedRef.current.includes(navigation.detail)),
		[scopedRef, navigations],
	);

	let busy = scoped.length !== 0;

	let loadingRef = useRef();
	let loading = useMemo(() => {
		if (busy) {
			let loading = loadingRef.current;
			if (loading) {
				return true;
			} else {
				return scoped[0].loading;
			}
		} else {
			return false;
		}
	}, [loadingRef, scoped]);

	useEffect(() => {
		loadingRef.current = loading;
	});

	let addNavigationDetail = useImmutableCallback(detail => {
		scopedRef.current.push(detail);
	});

	let removeNavigationDetail = useImmutableCallback(detail => {
		let index = scopedRef.current.indexOf(detail);
		if (index > -1) {
			scopedRef.current.splice(index, 1);
		}
	});

	return [scoped, busy, loading, { addNavigationDetail, removeNavigationDetail }];
}
