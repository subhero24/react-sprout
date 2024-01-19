import { useState, useMemo, createElement, forwardRef } from 'react';
import { useLoadingState } from './use-loading-state.js';

import Form from '../components/form.jsx';

import useRouter from './use-router.js';
import useImmutableCallback from './use-immutable-callback.js';

export default function useForm() {
	let router = useRouter();

	let [details, setDetails] = useState([]);
	let [pending, startPending, stopPending] = useLoadingState({
		delayLoadingMs: router.delayLoadingMs,
		minimumLoadingMs: router.minimumLoadingMs,
	});

	let navigateStart = useImmutableCallback(event => {
		let details = [...details, event.detail];
		setDetails(details);
		startPending();
	});

	let navigateStop = useImmutableCallback(event => {
		let details = details.filter(detail => detail !== event.detail);
		if (details.length === 0) {
			stopPending(true);
		}

		setDetails(details);
	});

	let navigateFinish = useImmutableCallback(event => {
		let details = details.filter(detail => detail !== event.detail);
		if (details.length === 0) {
			stopPending();
		}

		setDetails(details);
	});

	let Component = useMemo(() => {
		return forwardRef(function (props, ref) {
			let { onError, onAborted, onNavigateEnd, onNavigateStart, ...other } = props;

			function handleError(event, error) {
				onError(event, error);
				navigateFinish(event);
			}

			function handleAborted(event, error) {
				onAborted(event, error);
				navigateStop(event);
			}

			function handleNavigateEnd(event) {
				onNavigateEnd(event);
				navigateFinish(event);
			}

			function handleNavigateStart(event) {
				onNavigateStart(event);
				navigateStart(event);
			}

			return createElement(Form, {
				ref,
				onError: handleError,
				onAborted: handleAborted,
				onNavigateEnd: handleNavigateEnd,
				onNavigateStart: handleNavigateStart,
				...other,
			});
		});
	}, [navigateStart, navigateStop, navigateFinish]);

	return [Component, details.length === 0 ? false : details, pending];
}
