import { forwardRef } from 'react';

import useRouter from '../hooks/use-router.js';
import useOptions from '../hooks/use-options.js';
import useResolve from '../hooks/use-resolve.js';

import { GET } from '../constants.js';

const defaultEnctype = 'application/x-www-form-urlencoded';

function Form(props, ref) {
	let options = useOptions();

	let defaultRelative = true;
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
		relative = defaultRelative,
		onSubmit,
		onError,
		onCancel,
		onAborted,
		onNavigate,
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

				let action = submitter?.getAttribute('formaction') ?? resolvedPath;
				let method = submitter?.getAttribute('formmethod') ?? form.getAttribute('method') ?? GET;
				let enctype = submitter?.getAttribute('formenctype') ?? form.getAttribute('enctype') ?? defaultEnctype;
				let formData = new FormData(form, submitter);

				// Resolve always returns an absolute path, so we can use the components router without a problem
				router.navigate(action, {
					push,
					replace,
					state,
					title,
					cache,
					reload,
					method,
					sticky,
					enctype,
					formData,
					onError,
					onCancel,
					onAborted,
					onNavigate,
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
