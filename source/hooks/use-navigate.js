import useRouter from './use-router.js';
import useResolve from './use-resolve.js';
import useImmutableCallback from './use-immutable-callback.js';
import useNavigationsScope from './use-navigations-scope.js';

export default function useNavigate() {
	let router = useRouter();
	if (router == undefined) {
		throw new Error(`The useNavigate hook can only be used inside a Router component.`);
	}

	let resolve = useResolve();
	let [navigations, busy, loading, { addNavigationDetail, removeNavigationDetail }] = useNavigationsScope();

	let navigate = useImmutableCallback((to, options) => {
		if (to != undefined && typeof to !== 'string' && to instanceof URL === false) {
			[to, options] = [to?.to, to];
		}

		let { relative = true, ...other } = options ?? {};

		function onNavigateStart(event) {
			options?.onNavigateStart?.(event);
			addNavigationDetail(event.detail);
		}

		function onActionError(event, actionError) {
			options?.onActionError?.(event, actionError);
			removeNavigationDetail(event.detail);
		}

		function onAborted(event, reason) {
			options?.onAborted?.(event, reason);
			removeNavigationDetail(event.detail);
		}

		function onNavigateEnd(event, actionResult) {
			options?.onNavigateEnd?.(event, actionResult);
			removeNavigationDetail(event.detail);
		}

		return router.navigate(resolve(to, { relative }), {
			...other,
			onAborted,
			onActionError,
			onNavigateEnd,
			onNavigateStart,
		});
	});

	return [navigate, busy, loading, navigations];
}
