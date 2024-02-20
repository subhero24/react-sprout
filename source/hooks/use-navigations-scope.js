import { useEffect, useMemo, useRef } from 'react';
import { useNavigations } from '..';
import useImmutableCallback from './use-immutable-callback';

export default function useNavigationsScope() {
	let navigations = useNavigations();

	let scopedRef = useRef([]);
	let scopedMavigations = useMemo(
		() => navigations.filter(navigation => scopedRef.current.includes(navigation.detail)),
		[scopedRef, navigations],
	);

	let busy = scopedMavigations.length !== 0;

	let loadingRef = useRef();
	let loading = useMemo(() => {
		if (busy) {
			let loading = loadingRef.current;
			if (loading) {
				return true;
			} else {
				return scopedMavigations[0].loading;
			}
		} else {
			return false;
		}
	}, [loadingRef, busy, scopedMavigations]);

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

	return [scopedMavigations, busy, loading, { addNavigationDetail, removeNavigationDetail }];
}
