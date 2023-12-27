import { useInsertionEffect, useMemo } from 'react';

import { createConfig } from './utilities/config.js';
import { createRender } from './utilities/render.js';
import { createElements } from './utilities/elements.js';

import { pathParts } from './utilities/path.js';
import { nativeWindow } from './utilities/window.js';
import { nativeHistory } from './utilities/history.js';

import useRequest from './hooks/use-request.js';
import useLastValue from './hooks/use-last-value.js';
import useStateWithCallback from './hooks/use-state-with-callback.js';
import useImmutableCallback from './hooks/use-immutable-callback.js';

import { routerContext } from './hooks/use-router.js';
import { locationContext } from './hooks/use-location.js';

const GET = 'GET';
const POST = 'POST';

const PUSH = 'PUSH';
const REPLACE = 'REPLACE';

const FETCH = 'FETCH';
const RELOAD = 'RELOAD';
const TRANSITION = 'TRANSITION';

export default function Routes(...args) {
	let options;
	let elements;

	if (args.length === 1) {
		[elements, options = {}] = args;
	} else if (args.length === 2) {
		[options, elements] = args;
	}

	let pages = new Map();
	let config = createConfig(elements, options);

	let nativeRequests = Object.create(null);

	return function Router(props) {
		let {
			sticky: stickyDefault = false,
			request: routerRequest,
			delayPendingMs: delayMs = 50,
			minimalPendingMs: minimalMs = 500,
			onError: onRouterError,
			onCancel: onRouterCancel,
			onAborted: onRouterAborted,
			onNavigate: onRouterNavigate,
			onNavigateEnd: onRouterNavigateEnd,
			onNavigateStart: onRouterNavigateStart,
		} = props;

		let superRequest = useRequest();
		let externalRequest = routerRequest ?? superRequest;

		let nativeRequest;
		let native = externalRequest == undefined && nativeWindow;
		if (native) {
			nativeRequest = nativeRequests[nativeWindow.location.href];
			if (nativeRequest == undefined) {
				nativeRequest = nativeRequests[nativeWindow.location.href] = new Request(nativeWindow.location.href);
			}
		}

		let [page, setPage] = useStateWithCallback(() => {
			let request = externalRequest ?? nativeRequest;
			if (request == undefined) {
				throw new Error(
					`There is no "request" available for the router. Please provide a prop "request" or "defaultRequest" to your <Router> element, or alternatively wrap your <Router> within a <Request url={...}> element.`,
				);
			}

			let page = pages.get(request);
			if (page == undefined) {
				page = createPage(request);
				pages.set(request, page);
			}

			return page;
		});

		let externalRequested = useLastValue(externalRequest);
		if (externalRequested !== externalRequest) {
			setPage(createPage(externalRequest, { current: page }));
		}

		// let [reloadNavigation, setReloadNavigation] = useState()
		// let [fetchNavigations, setFetchNavigations] = useState([])
		// let [transitionNavigation, setTransitionNavigation] = useState()

		let locationUrl = page.render.request.url;
		let locationBase = page.request.url;
		let location = useMemo(() => new URL(locationUrl, locationBase), [locationUrl, locationBase]);
		let elements = useMemo(() => createElements(page.render.root), [page.render.root]);

		let navigate = useImmutableCallback((arg1, arg2) => {
			// navigate(options)
			// navigate(to, options)
			let to, options;
			if (arg1 == undefined || typeof arg1 === 'string' || to instanceof URL === true) {
				[to, options] = [arg1, arg2];
			} else if (arg2 == undefined) {
				[to, options] = [arg1?.to, arg1];
			}

			let {
				push,
				replace,
				title,
				state,
				data,
				sticky = stickyDefault,
				store = false, // Cache the new page
				cache = false, // Cache the old page
				reload = false,
				encoding,
				onError,
				onCancel,
				onAborted,
				onNavigate,
				onNavigateEnd,
				onNavigateStart,
			} = options ?? {};

			let url = new URL(to ?? '', location);
			let fix = url.href === location.href;
			let body = data;

			let caching;
			if (reload === false) caching = 'default';
			if (reload && store === true) caching = 'reload';
			if (reload && store === false) caching = 'no-store';

			let method = options?.method?.toUpperCase() ?? GET;
			if (method === GET && data) {
				let parts = pathParts(url.href);
				let pathName = parts[0];
				let pathHash = parts[2] ?? '';
				let pathSearch = new URLSearchParams(data);

				fix = false;
				url = new URL(`${pathName}?${pathSearch}${pathHash}`);
				body = undefined;
			}

			let type;
			if (fix && state == undefined) {
				type = push != undefined ? (push ? PUSH : REPLACE) : replace ?? true ? REPLACE : PUSH;
			} else {
				type = replace != undefined ? (replace ? REPLACE : PUSH) : push ?? true ? PUSH : REPLACE;
			}

			let intent;
			if (fix === false || type === PUSH || state !== undefined || title !== undefined) {
				intent = TRANSITION;
			} else if (method === POST) {
				intent = FETCH;
			} else if (reload) {
				intent = RELOAD;
			} else {
				return;
			}

			let detail = { url, type, state, title, intent, method, data, encoding };
			let event = new CustomEvent('navigate', { detail, cancelable: true });
			let request = new Request(url, { body, method, cache: caching });

			// When using an empty FormData as Request.body will result
			// in chrome erroring with a TypeError: failed to fetch
			// This is a bug and could be tested in console with:
			// (new Request('url', { body: new FormData(), method: 'POST' })).formData()
			// This should work, and works fine in firefox
			if (body instanceof FormData && [...body].length === 0) {
				console.warn(
					`FormData has no entries. This will result in a "failed to fetch" error in Chrome. Make sure your form has at least 1 named input field.`,
				);
			}

			onNavigate?.(event);
			onRouterNavigate?.(event);
			if (native) {
				nativeWindow?.dispatchEvent(event);
			}

			if (event.defaultPrevented) {
				onCancel?.(event);
				onRouterCancel(event);
				return;
			}

			onNavigateStart?.(event);
			onRouterNavigateStart?.(event);

			// Start & stop reloading spinners
			// Start & stop navigating spinners

			let callbacks = { onError, onAborted, onNavigateEnd };
			let navigation = createPage(request, { current: page, event, cache, sticky, callbacks });

			// Do this after action
			setPage(navigation, () => {
				if (native) {
					if (typeof state === 'function') {
						state = state(navigation.action?.resource.result);
					}

					if (type === PUSH) {
						nativeHistory?.pushState(state, title, navigation.render.request.url);
					} else if (type === REPLACE) {
						nativeHistory?.pushState(state, title, navigation.render.request.url);
					}
				}
			});
		});

		let reload = useImmutableCallback(options => {
			let { sticky, onCancel, onAborted, onNavigate, onNaivgateEnd, onNavigateStart } = options ?? {};

			navigate({ reload: true, sticky, onCancel, onAborted, onNavigate, onNaivgateEnd, onNavigateStart });
		});

		let abort = useImmutableCallback(() => {
			// Call onAborted of the background page

			setPage(page);
		});

		useInsertionEffect(() => {
			if (native) {
				function handlePopstate() {
					let nativeRequest = new Request(nativeWindow.location);
					let nativePage = createPage(nativeRequest); // Need to add { current: pageRef.current }

					setPage(nativePage);
				}

				nativeWindow?.addEventListener('popstate', handlePopstate);

				return function () {
					nativeWindow?.removeEventListener('popstate', handlePopstate);
				};
			}
		}, [native]);

		let routerContextValue = useMemo(() => ({ navigate, reload, abort }), [navigate, reload, abort]);

		return (
			<routerContext.Provider value={routerContextValue}>
				<locationContext.Provider value={location}>{elements}</locationContext.Provider>
			</routerContext.Provider>
		);

		function createPage(request, options) {
			let { current, event, cache, sticky = stickyDefault, callbacks } = options ?? {};

			// terminate other navigations?

			let render = createRender(config, request);

			let page = { request, render };

			return page;
		}
	};
}
