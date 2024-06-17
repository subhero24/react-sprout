import { useMemo, createElement, forwardRef } from 'react';

import Form from '../components/form.jsx';

import useNavigationsScope from './use-navigations-scope.js';

export default function useForm() {
	let [navigations, busy, loading, { addNavigationDetail, removeNavigationDetail }] = useNavigationsScope();

	let Component = useMemo(() => {
		return forwardRef(function (props, ref) {
			function onNavigateStart(event) {
				props?.onNavigateStart?.(event);
				addNavigationDetail(event.detail);
			}

			function onActionError(event, actionError) {
				props?.onActionError?.(event, actionError);
				removeNavigationDetail(event.detail);
			}

			function onAborted(event, reason) {
				props?.onAborted?.(event, reason);
				removeNavigationDetail(event.detail);
			}

			function onNavigateEnd(event, actionResult) {
				props?.onNavigateEnd?.(event, actionResult);
				removeNavigationDetail(event.detail);
			}

			return createElement(Form, {
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
