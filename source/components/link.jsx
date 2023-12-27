import { forwardRef } from 'react';

import useRouter from '../hooks/use-router.js';
import useResolve from '../hooks/use-resolve.js';

function Link(props, ref) {
	let router = useRouter();

	let {
		href,
		target,
		reload,
		push,
		replace,
		title,
		state,
		sticky,
		relative = true,
		onClick,
		onError,
		onCancel,
		onAborted,
		onNavigate,
		onNavigateEnd,
		onNavigateStart,
		...other
	} = props;

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

				router.navigate(resolvedPath, {
					state,
					title,
					reload,
					push,
					replace,
					sticky,
					onError,
					onCancel,
					onAborted,
					onNavigate,
					onNavigateEnd,
					onNavigateStart,
				});
			}
		}
	}

	return <a ref={ref} href={resolvedPath} target={target} onClick={handleClick} {...other} />;
}

export default forwardRef(Link);
