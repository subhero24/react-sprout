import { useEffect, useInsertionEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { createConfig } from './utilities/config.js';
import { createRender } from './utilities/render.js';
import { createAction } from './utilities/action.js';
import { createLoaders } from './utilities/loaders.js';
import { createPromise } from './utilities/promise.js';
import { createElements } from './utilities/elements.js';
import { createScheduler, resetScheduler } from './utilities/scheduler.js';

import { nativeWindow } from './utilities/window.js';
import { nativeHistory } from './utilities/history.js';

import { pathParts } from './utilities/path.js';

import useRequest from './hooks/use-request.js';
import useLastValue from './hooks/use-last-value.js';
import useMountedRef from './hooks/use-mounted-ref.js';
import useImmutableCallback from './hooks/use-immutable-callback.js';
import useStateWithCallback from './hooks/use-state-with-callback.js';

import { routerContext } from './hooks/use-router.js';
import { actionsContext } from './hooks/use-actions.js';
import { loadersContext } from './hooks/use-loaders.js';
import { optionsContext, defaultOptions } from './hooks/use-options.js';
import { locationContext } from './hooks/use-location.js';
import { navigationsContext } from './hooks/use-navigations.js';

import { GET, POST } from './constants.js';
import { PUSH, REPLACE } from './constants.js';
import { FETCH, RELOAD, TRANSITION } from './constants.js';
import { URLENCODED } from './constants.js';

import sleep from '../test/utilities/sleep.js';
import startTransition from './utilities/transition.js';

const identityTransform = id => id;

export default function Routes(...args) {
	let options;
	let elements;

	if (args.length === 1) {
		[elements, options = {}] = args;
	} else if (args.length === 2) {
		[options, elements] = args;
	}

	let config = createConfig(elements, options);

	let suspenseRequestByHrefCache = new Map();
	let suspensePageByRequestCache = new Map();

	return function Router(props) {
		let {
			sticky: stickyDefault = false,
			request: routerRequest,
			delayLoadingMs = defaultOptions.delayLoadingMs,
			minimumLoadingMs = defaultOptions.minimumLoadingMs,
			defaultFormMethod = defaultOptions.defaultFormMethod,
			transformFormData = identityTransform,
			onError: onRouterError,
			onCancel: onRouterCancel,
			onAborted: onRouterAborted,
			onNavigate: onRouterNavigate,
			onNavigateEnd: onRouterNavigateEnd,
			onNavigateStart: onRouterNavigateStart,
		} = props;

		// cacheRef keeps track of chaced pages in the history, allowing popstate to reuse previous page loaders
		let cacheRef = useRef([]);

		let pageRef = useRef(); // this is for the current page
		let otherRef = useRef(); // this is for the next page
		let pagesRef = useRef([]); // this is for the concurrent fetch navigation pages

		let mountedRef = useMountedRef();
		let mounted = mountedRef.current;

		let onRouterErrorCallback = useImmutableCallback(onRouterError);
		let onRouterCancelCallback = useImmutableCallback(onRouterCancel);
		let onRouterAbortedCallback = useImmutableCallback(onRouterAborted);
		let onRouterNavigateCallback = useImmutableCallback(onRouterNavigate);
		let onRouterNavigateEndCallback = useImmutableCallback(onRouterNavigateEnd);
		let onRouterNavigateStartCallback = useImmutableCallback(onRouterNavigateStart);

		let abortPage = useImmutableCallback((page, reason) => {
			page.promise.reject(reason);
			page.action?.controller.abort(reason);
			page.loaders?.forEach(loader => loader.controller.abort(reason));
			page.callbacks?.onAborted?.(page.event, reason);

			onRouterAbortedCallback?.(page.event, reason);
		});

		let cleanCache = useImmutableCallback(() => {
			for (let initialPage of suspensePageByRequestCache.values()) {
				if (initialPage !== page) {
					abortPage(initialPage);
				}
			}
		});

		let superRequest = useRequest();
		let externalRequest = routerRequest ?? superRequest;

		let native = externalRequest == undefined && nativeWindow;
		let nativeHref = nativeWindow?.location.href;
		let nativeRequest = useMemo(() => {
			let mounted = mountedRef.current;
			if (native) {
				let request;
				if (mounted) {
					request = new Request(nativeHref);
				} else {
					request = suspenseRequestByHrefCache.get(nativeHref);
					if (request == undefined) {
						request = new Request(nativeHref);
						suspenseRequestByHrefCache.set(nativeHref, request);
					}
				}

				return request;
			}
		}, [mountedRef, native, nativeHref]);

		let [error, setError] = useState();
		let [navigations, setNavigations] = useState([]);

		let [page, setPage] = useStateWithCallback(() => {
			let request = externalRequest ?? nativeRequest;
			if (request == undefined) {
				throw new Error(
					`There is no "request" available for the router. Please provide a prop "request" or "defaultRequest" to your <Router> element, or alternatively wrap your <Router> within a <Request url={...}> element.`,
				);
			}

			let page = suspensePageByRequestCache.get(request);
			if (page == undefined) {
				page = createPage(request);
				suspensePageByRequestCache.set(request, page);
			}

			return page;
		});

		// When the externalRequest changes, we reset the page
		// ExternalRequest also is different when initial rendering has an externalRequest,
		// in that case, the page was already set in the pages state initializer
		let externalRequested = useLastValue(externalRequest);
		if (externalRequested !== externalRequest && mounted) {
			setPage(createPage(externalRequest, { cache: page }));
		}

		let locationUrl = page.render.request.url;
		let locationBase = page.request.url;
		let location = useMemo(() => new URL(locationUrl, locationBase), [locationUrl, locationBase]);
		let elements = useMemo(() => createElements(page.render.root), [page.render.root]);

		let navigate = useImmutableCallback(async (arg1, arg2) => {
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
				formData,
				cache = false,
				reload = false,
				sticky = stickyDefault,
				enctype,
				onError,
				onCancel,
				onAborted,
				onNavigate,
				onNavigateEnd,
				onNavigateStart,
			} = options ?? {};

			let url = new URL(to ?? '', location);
			let fix = url.href === location.href;

			if (data == undefined && formData != undefined) {
				data = transformFormData(formData);
			}

			let body;
			let method = options?.method?.toUpperCase() ?? (formData ? defaultFormMethod : GET);
			if (method === GET && formData) {
				let parts = pathParts(url.href);
				let pathName = parts[0];
				let pathHash = parts[2] ?? '';
				let pathSearch = new URLSearchParams(formData);

				fix = false;
				url = new URL(`${pathName}?${pathSearch}${pathHash}`);
			} else {
				body = data;
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

			let cached = reload ? 'reload' : 'default';
			let headers = enctype ? { 'Content-Type': enctype } : {};
			let request = new Request(url, { method, headers, body, cache: cached });

			let detail = { request, type, state, title, intent };
			let event = new CustomEvent('navigate', { detail, cancelable: true });

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
			onRouterNavigateCallback(event);
			if (native) {
				nativeWindow?.dispatchEvent(event);
			}

			if (event.defaultPrevented) {
				onCancel?.(event);
				onRouterCancelCallback(event);
				return;
			}

			onNavigateStart?.(event);
			onRouterNavigateStartCallback(event);

			let navigation = { loading: delayLoadingMs === 0, status: undefined, detail };
			let exclusive = !sticky && intent !== FETCH;
			if (exclusive) {
				setNavigations([navigation]);
			} else {
				let concurrency = intent === FETCH && navigations[0]?.detail?.intent === FETCH;
				if (concurrency) {
					setNavigations(navigations => [...navigations, navigation]);
				} else {
					setNavigations([navigation]);
				}

				if (delayLoadingMs > 0) {
					setTimeout(() => {
						setNavigations(navigations => {
							let index = navigations.findIndex(navigation => navigation.detail === detail);
							if (index === -1) {
								return navigations;
							} else {
								return navigations.map((navigation, i) =>
									i !== index ? navigation : { ...navigation, loading: true },
								);
							}
						});
					}, delayLoadingMs);
				}
			}

			let callbacks = { onError, onAborted, onNavigateEnd };
			let navigationPage = createPage(request, { cache: page, event, detail, callbacks });

			try {
				let delayLoadingPromise = sleep(delayLoadingMs);

				await Promise.race([navigationPage.promise, navigationPage.actionPromise]);
				await Promise.race([navigationPage.promise, navigationPage.loadersPromise, delayLoadingPromise]);

				// The page loader schedulers by default also include the action time, because if the page
				// was initally loaded with a POST request, the page was already rendered while executing the loaders
				// If a new navigation is initiated on a rendered page itself, we wait for the action to complete to render
				// the new page. So the schedulers should really not include the action anymore.
				// So before rendering the page, we reset the schedulers so that the minimumLoadingMs of the loader
				// schedulers start fresh when the new page is rendered.

				// We can not do this in an effect because it still resolves the suspended component before running the effect
				// flashing the loading indicator
				for (let loader of navigationPage.loaders) {
					resetScheduler(loader.resource.scheduler, { delayLoadingMs: 0 });
				}

				startTransition(sticky, () => {
					setNavigations(navigations => navigations.filter(navigation => navigation.detail !== detail));
					setPage(navigationPage, () => {
						// Update history after navigationPage
						if (native) {
							if (typeof state === 'function') {
								state = state(navigationPage.action?.resource.result);
							}

							if (type === PUSH) {
								// If pushing the history, cache the old
								if (cache) {
									cacheRef.current[nativeHistory.length - 1] = page;
								}

								nativeHistory.pushState(state, title, navigationPage.render.request.url);
							} else if (type === REPLACE) {
								nativeHistory.replaceState(state, title, navigationPage.render.request.url);
							}

							// When a navigation happens, after a popstate to the middle of the history stack
							// the history forward items are no longer accessible, and we should clear these pages
							// from the history cache.
							cacheRef.current = cacheRef.current.slice(0, nativeHistory.length - 1);
						}

						onNavigateEnd?.(event);
						onRouterNavigateEndCallback(event);
					});
				});
			} catch (error) {
				// We use a promise to bail out if needed (ie abort), but this is not an error,
				// so we catch it and do nothing
			}
		});

		let reload = useImmutableCallback(options => {
			let { sticky, onCancel, onAborted, onNavigate, onNaivgateEnd, onNavigateStart } = options ?? {};

			navigate({ reload: true, sticky, onCancel, onAborted, onNavigate, onNaivgateEnd, onNavigateStart });
		});

		let abort = useImmutableCallback(aborted => {
			let otherPage = otherRef.current;
			let abortedDetail = aborted?.detail ?? aborted;
			if (abortedDetail) {
				setPage(page);
				setNavigations(navigations.filter(navigation => navigation.detail !== abortedDetail));

				if (otherPage && otherPage.detail === abortedDetail) {
					abortPage(otherPage, `Navigation to "${otherPage.request.url}" was aborted`);
				} else {
					let abortedPage = pagesRef.current.find(page => page.detail === abortedDetail);
					if (abortedPage) {
						abortPage(abortedPage, `Navigation to "${abortedPage.request.url}" was aborted`);
					}
				}
			} else {
				setPage(page);
				setNavigations([]);

				if (otherPage) {
					abortPage(otherPage, `Navigation to "${otherPage.request.url}" was aborted`);
				}

				for (let page of pagesRef.current) {
					abortPage(page, `Navigation to "${page.request.url}" was aborted`);
				}
			}
		});

		// Clean suspense cache
		useEffect(() => {
			cleanCache();

			suspensePageByRequestCache.clear();
			suspenseRequestByHrefCache.clear();
		}, [cleanCache]);

		// Abort the previous page and keep track of the new one
		useLayoutEffect(() => {
			let previousPage = pageRef.current;
			if (previousPage) {
				abortPage(previousPage, page.request);
			}

			pageRef.current = page;
			otherRef.current = undefined;
		}, [page, pageRef, otherRef, abortPage]);

		// Update page on popstate
		// Use insertion effect in case someone navigates with the history in a useEffect or useLayoutEffect
		// as child effects are run before parent effects
		useInsertionEffect(() => {
			if (native) {
				function handlePopstate() {
					let request = new Request(nativeWindow.location);
					let cachedPage = cacheRef.current.findLast(page => page?.request.url === request.url);
					let nativePage = createPage(request, { cache: cachedPage });

					setPage(nativePage);
				}

				nativeWindow?.addEventListener('popstate', handlePopstate);

				return function () {
					nativeWindow?.removeEventListener('popstate', handlePopstate);
				};
			}
		}, [native]);

		// Update resources to prevent spinner flicker on newly rendered page
		useLayoutEffect(() => {
			for (let loader of page.loaders) {
				if (loader.resource.status === 'busy') {
					resetScheduler(loader.resource.scheduler, { delayLoadingMs: 0 });
				}
			}
		}, [page]);

		let routerContextValue = useMemo(() => ({ navigate, reload, abort }), [navigate, reload, abort]);
		let optionsContextValue = useMemo(
			() => ({ delayLoadingMs, minimumLoadingMs, defaultFormMethod }),
			[delayLoadingMs, minimumLoadingMs, defaultFormMethod],
		);

		return (
			<routerContext.Provider value={routerContextValue}>
				<optionsContext.Provider value={optionsContextValue}>
					<navigationsContext.Provider value={navigations}>
						<actionsContext.Provider value={page.action}>
							<loadersContext.Provider value={page.loaders}>
								<locationContext.Provider value={location}>{elements}</locationContext.Provider>
							</loadersContext.Provider>
						</actionsContext.Provider>
					</navigationsContext.Provider>
				</optionsContext.Provider>
			</routerContext.Provider>
		);

		function createPage(requested, options) {
			let { cache, event, callbacks } = options ?? {};

			let render = createRender(config, requested);
			let request = render.request;

			let result = { request, event, render, callbacks };

			result.promise = createPromise();
			result.actionPromise = createActionPromise();
			result.loadersPromise = createLoadersPromise();

			let intent = event?.detail.intent;
			if (intent === FETCH) {
				let otherPage = otherRef.current;
				if (otherPage) {
					abortPage(otherPage, requested);
				}

				otherRef.current = undefined;
				pagesRef.current.push(result);
			} else {
				let otherPage = otherRef.current;
				if (otherPage) {
					abortPage(otherPage, requested);
				}

				for (let page of pagesRef.current) {
					abortPage(page, requested);
				}

				pagesRef.current = [];
				otherRef.current = result;
			}

			async function createActionPromise() {
				let method = request.method;
				if (method === POST) {
					let mounted = mountedRef.current;
					if (mounted) {
						for (let loader of page.loaders) {
							loader.dirty = true;
						}
					}

					let otherPage = otherRef.current;
					if (otherPage) {
						for (let loader of otherPage.loaders) {
							loader.dirty = true;
						}
					}

					for (let page of pagesRef.current) {
						for (let loader of page.loaders) {
							loader.dirty = true;
						}
					}

					for (let page of cacheRef.current) {
						for (let loader of page.loaders) {
							loader.dirty = true;
						}
					}

					let scheduler = createScheduler({ delayLoadingMs, minimumLoadingMs });
					result.action = createAction(render, { request, scheduler });
					result.action.promise.catch(actionError);
					result.action.promise.finally(actionFinished);

					return Promise.race([result.promise, event ? result.action.resource.promise : result.action.promise]);

					function actionError(error) {
						if (event) {
							callbacks?.onError?.(event, error);
							onRouterErrorCallback(event, error);
						} else {
							setError(error);
						}
					}

					function actionFinished() {
						result.timestamp = Date.now();
					}
				}
			}

			async function createLoadersPromise() {
				let action = result.actionPromise;

				let loaders;
				let useCache = request.cache !== 'reload' && request.cache !== 'no-store';
				if (useCache) {
					loaders = cache?.loaders;
				}

				let scheduler = createScheduler({ delayLoadingMs, minimumLoadingMs });

				result.loaders = createLoaders(render, { action, loaders, scheduler });

				try {
					let loaderPromises = result.loaders.map(loader => loader.resource.promise);
					let loaderResults = await Promise.race([result.promise, Promise.allSettled(loaderPromises)]);

					return loaderResults;
				} catch (error) {
					console.warn(error);
				}
			}

			return result;
		}
	};
}
