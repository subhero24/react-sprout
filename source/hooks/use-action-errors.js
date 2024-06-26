import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import useRouter from './use-router.js';
import useActionError from './use-action-error.js';
import useImmutableCallback from './use-immutable-callback';

export let errorsContext = createContext();

export default function useActionErrors() {
	let router = useRouter();
	let actionError = useActionError();
	let actionErrors = useContext(errorsContext);

	let [initialError, setInitialError] = useState(actionError);

	let dismiss = useImmutableCallback(error => {
		if (error === initialError) {
			setInitialError();
		} else {
			router.dismiss(error);

			if (error == undefined) {
				setInitialError();
			}
		}
	});

	useEffect(() => router.subscribe());

	let errors = useMemo(() => {
		if (initialError) {
			return [initialError, ...actionErrors];
		} else {
			return actionErrors;
		}
	}, [initialError, actionErrors]);

	return [errors, dismiss];
}
