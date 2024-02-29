import { forwardRef } from 'react';

import useRouter from '../hooks/use-router.js';
import useResolve from '../hooks/use-resolve.js';

function Link(props, ref) {
	let {
		href,
		target,
		reload,
		push,
		replace,
		title,
		state,
		cache,
		sticky,
		relative = true,
		onClick,
		onCancel,
		onAborted,
		onNavigate,
		onActionError,
		onNavigateEnd,
		onNavigateStart,
		...other
	} = props;

	let router = useRouter();
	let resolve = useResolve();
	let resolvedPath = resolve(href, { relative });

	function handleClick(event) {
		onClick?.(event);

		if (event.defaultPrevented == false) {
			let isLeftClick = event.button === 0;
			let isSelfTarget = target == undefined || target === '_self';
			let hasModifierKey = event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
			let shouldNavigate = !hasModifierKey && isLeftClick && isSelfTarget;
			if (shouldNavigate && router) {
				event.preventDefault();

				// Resolve always returns an absolute path, so we can use the components router without a problem
				router.navigate(resolvedPath, {
					state,
					title,
					cache,
					push,
					replace,
					sticky,
					reload,
					onCancel,
					onAborted,
					onNavigate,
					onActionError,
					onNavigateEnd,
					onNavigateStart,
				});
			}
		}
	}

	return <a ref={ref} href={resolvedPath} target={target} onClick={handleClick} {...other} />;
}

export default forwardRef(Link);
