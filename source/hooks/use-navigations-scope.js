import { useEffect, useMemo, useRef } from 'react';
import { useNavigations } from '..';
import useImmutableCallback from './use-immutable-callback';

export default function useNavigationsScope() {
	let navigations = useNavigations();

	let scopedRef = useRef([]);
	let scopedNavigations = useMemo(() => navigations.filter(navigation => scopedRef.current.includes(navigation.detail)), [scopedRef, navigations]);

	let busy = scopedNavigations.length !== 0;

	let loadingRef = useRef();
	let loading = useMemo(() => {
		if (busy) {
			let loading = loadingRef.current;
			if (loading) {
				return true;
			} else {
				return scopedNavigations[0].loading;
			}
		} else {
			return false;
		}
	}, [loadingRef, busy, scopedNavigations]);

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

	return [scopedNavigations, busy, loading, { addNavigationDetail, removeNavigationDetail }];
}
