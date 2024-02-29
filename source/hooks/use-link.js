import { useMemo, createElement, forwardRef } from 'react';

import Link from '../components/link.jsx';

import useNavigationsScope from './use-navigations-scope';

export default function useLink() {
	let [navigations, busy, loading, { addNavigationDetail, removeNavigationDetail }] = useNavigationsScope();

	let Component = useMemo(() => {
		return forwardRef(function (props, ref) {
			function onActionError(event, error) {
				props?.onActionError?.(event, error);
				removeNavigationDetail(event.detail);
			}

			function onAborted(event, reason) {
				props?.onAborted?.(event, reason);
				removeNavigationDetail(event.detail);
			}

			function onNavigateStart(event) {
				props?.onNavigateStart?.(event);
				addNavigationDetail(event.detail);
			}

			function onNavigateEnd(event) {
				props?.onNavigateEnd?.(event);
				removeNavigationDetail(event.detail);
			}

			return createElement(Link, {
				ref,
				...props,
				onAborted,
				onActionError,
				onNavigateEnd,
				onNavigateStart,
			});
		});
	}, [addNavigationDetail, removeNavigationDetail]);

	return [Component, busy, loading, navigations];
}
