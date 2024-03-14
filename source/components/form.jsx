import { forwardRef } from 'react';

import useRouter from '../hooks/use-router.js';
import useOptions from '../hooks/use-options.js';
import useResolve from '../hooks/use-resolve.js';

import { GET } from '../constants.js';
import { URLENCODED } from '../constants.js';

function Form(props, ref) {
	let options = useOptions();

	let defaultFormMethod = options.defaultFormMethod === GET ? undefined : options.defaultFormMethod;

	let {
		push,
		replace,
		title,
		state,
		cache,
		action,
		reload,
		sticky,
		method = defaultFormMethod,
		relative = true,
		onSubmit,
		onAborted,
		onCanceled,
		onNavigate,
		onActionError,
		onNavigateStart,
		onNavigateEnd,
		...other
	} = props;

	let router = useRouter();

	let resolve = useResolve();
	let resolvedPath = resolve(action, { relative });

	function handleSubmit(event) {
		onSubmit?.(event);

		if (event.defaultPrevented == false) {
			let form = event.target;
			let submitter = event.nativeEvent.submitter;

			let target = submitter?.getAttribute('formtarget') ?? form.getAttribute('target');
			let shouldNavigate = target == undefined || target === '_self';
			if (shouldNavigate && router) {
				event.preventDefault();

				let target = form;
				let action = submitter?.getAttribute('formaction') ?? resolvedPath;
				let method = submitter?.getAttribute('formmethod') ?? form.getAttribute('method') ?? GET;
				let enctype = submitter?.getAttribute('formenctype') ?? form.getAttribute('enctype') ?? URLENCODED;

				let data = new FormData(form, submitter);
				if (method.toLowerCase() === GET || enctype.toLowerCase() === URLENCODED) {
					data = new URLSearchParams(data);
				}

				// Resolve always returns an absolute path, so we can use the components router without a problem
				router.navigate(action, {
					push,
					replace,
					state,
					title,
					data,
					cache,
					reload,
					method,
					target,
					sticky,
					onAborted,
					onCanceled,
					onNavigate,
					onActionError,
					onNavigateEnd,
					onNavigateStart,
				});
			} else {
				form.requestSubmit(submitter);
			}
		}
	}

	return <form ref={ref} action={resolvedPath} method={method} onSubmit={handleSubmit} {...other} />;
}

export default forwardRef(Form);
