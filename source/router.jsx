import { useEffect, useInsertionEffect, useMemo, useRef, useState } from 'react';

import { createConfig } from './utilities/config.js';
import { createRender } from './utilities/render.js';
import { createAction } from './utilities/action.js';
import { createLoaders } from './utilities/loaders.js';
import { createPromise, isResolved } from './utilities/promise.js';
import { createElements } from './utilities/elements.js';
import { createScheduler, resetScheduler } from './utilities/scheduler.js';
import { createTransition } from './utilities/transition.js';

import { nativeWindow } from './utilities/window.js';
import { nativeHistory } from './utilities/history.js';
import { nativeDocument } from './utilities/document.js';

import { routerContext } from './hooks/use-router.js';
import { errorsContext } from './hooks/use-action-errors.js';
import { historyContext } from './hooks/use-history.js';
import { locationContext } from './hooks/use-location.js';
import { pageActionContext } from './hooks/use-page-action.js';
import { pageLoadersContext } from './hooks/use-page-loaders.js';
import { navigationsContext } from './hooks/use-navigations.js';
import { optionsContext, defaultOptions } from './hooks/use-options.js';

import { GET, POST } from './constants.js';
import { PUSH, REPLACE } from './constants.js';
import { FETCH, RELOAD, TRANSITION } from './constants.js';

import { pathParts } from './utilities/path.js';

import useRequest from './hooks/use-request.js';
import useLastValue from './hooks/use-last-value.js';
import useMountedRef from './hooks/use-mounted-ref.js';
import useLayoutEffect from './hooks/use-layout-effect.js';
import useImmutableCallback from './hooks/use-immutable-callback.js';
import useStateWithCallback from './hooks/use-state-with-callback.js';

import sleep from '../test/utilities/sleep.js';

let historyBaseLength = nativeHistory?.length ?? 0;

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
		let { request: routerRequest, defaultRequest: routerInitialRequest, sticky: stickyDefault, dataTransform, relativeHistory = false, delayLoadingMs = defaultOptions.delayLoadingMs, minimumLoadingMs = defaultOptions.minimumLoadingMs, defaultFormMethod = defaultOptions.defaultFormMethod, onAborted: onRouterAborted, onCanceled: onRouterCancel, onNavigate: onRouterNavigate, onActionError: onRouterActionError, onNavigateEnd: onRouterNavigateEnd, onNavigateStart: onRouterNavigateStart } = props;

		// cacheRef keeps track of chaced pages in the history, allowing popstate to reuse previous page loaders
		let cacheRef = useRef([]);

		// a fake history is kept to allow background rendering with the new history
		// before the navigation completes and the history effectively changes
		let historyRef = useRef();

		// actions and loaders have started before the pages are rendered
		// we have to do some bookkeeping to manage resources of concurrent pages
		let pageRef = useRef(); // this is for the current page
		let nextRef = useRef(); // this is for the next page
		let pagesRef = useRef([]); // this is for the concurrent fetch navigation pages

		let mountedRef = useMountedRef();
		let mounted = mountedRef.current;

		let onRouterCancelCallback = useImmutableCallback(onRouterCancel);
		let onRouterAbortedCallback = useImmutableCallback(onRouterAborted);
		let onRouterNavigateCallback = useImmutableCallback(onRouterNavigate);
		let onRouterActionErrorCallback = useImmutableCallback(onRouterActionError);
		let onRouterNavigateEndCallback = useImmutableCallback(onRouterNavigateEnd);
		let onRouterNavigateStartCallback = useImmutableCallback(onRouterNavigateStart);

		let errorConsumerCountRef = useRef(0);
		let [errors, setErrors] = useState([]);

		let dismiss = useImmutableCallback(error => {
			if (error == undefined) {
				setErrors([]);
			} else {
				setErrors(errors => errors.filter(e => e !== error));
			}
		});

		let subscribe = useImmutableCallback(() => {
			errorConsumerCountRef.current++;

			return function () {
				errorConsumerCountRef.current = Math.max(errorConsumerCountRef.current - 1, 0);
			};
		});

		let [navigations, setNavigations] = useState([]);

		let abortPage = useImmutableCallback((page, reason) => {
			page.promise.reject(reason);
			page.action?.controller.abort(reason);
			page.loaders?.forEach(loader => loader.controller.abort(reason));
			page.callbacks?.onAborted?.(page.event, reason);

			setNavigations(navigations => navigations.filter(navigation => navigation.detail !== page.event?.detail));

			onRouterAbortedCallback?.(page.event, reason);
		});

		let cleanCache = useImmutableCallback(() => {
			for (let initialPage of suspensePageByRequestCache.values()) {
				if (initialPage !== page) {
					abortPage(initialPage);
				}
			}
		});

		let [superRequest, superInitialRequest] = useRequest();

		let initialRequest = routerRequest ?? routerInitialRequest ?? superRequest ?? superInitialRequest;

		let native = useRef(initialRequest == undefined).current;
		let nativeRequest = useMemo(() => {
			let mounted = mountedRef.current;
			if (native) {
				let nativeHref = nativeWindow?.location.href;
				if (nativeHref) {
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
			}
		}, [mountedRef, native]);

		let [page, setPage] = useStateWithCallback(() => {
			let request = initialRequest ?? nativeRequest;
			if (request == undefined) {
				throw new Error(`There is no "request" available for the router. Please provide a "request" or "defaultRequest" property to your <Router> element, or alternatively wrap your <Router> within a <Request> element.`);
			}

			let page = suspensePageByRequestCache.get(request);
			if (page == undefined) {
				page = createPage(request.clone());
				suspensePageByRequestCache.set(request, page);
			}

			return page;
		});

		// When the externalRequest changes, we reset the page
		// ExternalRequest also is different when initial rendering has an externalRequest,
		// in that case, the page was already set in the pages state initializer
		let externalRequest = routerRequest ?? superRequest;
		let externalRequested = useLastValue(externalRequest);
		if (externalRequested !== externalRequest && mounted) {
			historyRef.current = undefined;
			setPage(createPage(externalRequest.clone(), { cache: page.fresh && page }));
		}

		let elements = useMemo(() => createElements(page.render.root), [page.render.root]);
		let location = useMemo(() => new URL(page.render.request.url), [page.render.request.url]);
		let history = useMemo(() => {
			if (native && nativeHistory) {
				return {
					go: (...args) => nativeHistory?.go(...args),
					back: (...args) => nativeHistory?.back(...args),
					forward: (...args) => nativeHistory?.forward(...args),
					pushState: (state, title = null, url) => nativeHistory?.pushState(state, title, url),
					replaceState: (state, title = null, url) => nativeHistory?.replaceState(state, title, url),
					get length() {
						return nativeHistory.length + (historyRef.current?.type === PUSH ? 1 : 0) - (relativeHistory ? historyBaseLength - 1 : 0);
					},
					get state() {
						return historyRef.current ? historyRef.current.state : nativeHistory.state;
					},
					get scrollRestoration() {
						return nativeHistory.scrollRestoration;
					},
					set scrollRestoration(scroll) {
						nativeHistory.scrollRestoration = scroll;
					},
				};
			}
		}, [native, historyRef, relativeHistory]);

		let navigate = useImmutableCallback(async (arg1, arg2) => {
			// navigate(options)
			// navigate(to, options)
			let to, options;
			if (arg1 == undefined || typeof arg1 === 'string' || to instanceof URL === true) {
				[to, options] = [arg1, arg2];
			} else if (arg2 == undefined) {
				[to, options] = [arg1?.to, arg1];
			}

			let { push, replace, title, state, data, target, cache = false, event: eventOriginal, reload = false, sticky = stickyDefault, onAborted, onCanceled, onNavigate, onActionError, onNavigateEnd, onNavigateStart } = options ?? {};

			let url = new URL(to ?? '', location);
			let fix = url.href === location.href;

			let body;
			let method = options?.method?.toLowerCase() ?? (data ? POST : GET);
			if (method === GET && data) {
				let parts = pathParts(url.href);
				let pathName = parts[0];
				let pathHash = parts[2] ?? '';
				let pathSearch = new URLSearchParams(data);

				fix = false;
				url = new URL(`${pathName}?${pathSearch}${pathHash}`);
			} else if (data) {
				body = data;
			}

			let type;
			if (fix && state == undefined) {
				type = push != undefined ? (push ? PUSH : REPLACE) : (replace ?? true) ? REPLACE : PUSH;
			} else {
				type = replace != undefined ? (replace ? REPLACE : PUSH) : (push ?? true) ? PUSH : REPLACE;
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
			let request = new Request(url, { method, body, cache: cached });

			if (data && dataTransform) {
				data = dataTransform(data, request);
			}

			let detail = { request, intent, data };
			let event = new CustomEvent('navigate', { detail, cancelable: true });
			if (eventOriginal) {
				event.originalEvent = eventOriginal;
			}

			// When using an empty FormData as Request.body will result
			// in chrome erroring with a TypeError: failed to fetch
			// This is a bug and could be tested in console with:
			// (new Request('url', { body: new FormData(), method: 'POST' })).formData()
			// This should work, and works fine in firefox
			if (process.env.NODE_ENV && body instanceof FormData && [...body].length === 0) {
				console.warn(`FormData has no entries. This will result in a "failed to fetch" error in Chrome. Make sure your form has at least 1 named input field.`);
			}

			onNavigate?.(event);
			onRouterNavigateCallback(event);
			if (target) {
				target.dispatchEvent(event);
			}

			if (event.defaultPrevented) {
				onCanceled?.(event);
				onRouterCancelCallback(event);
				return;
			}

			onNavigateStart?.(event);
			onRouterNavigateStartCallback(event);

			// Do not navigate to a new url in a controlled component
			if (externalRequest && intent === TRANSITION) return;

			let navigation = { loading: delayLoadingMs === 0, detail };
			let concurrent = intent === FETCH && navigations[0]?.detail.intent === FETCH;
			if (concurrent) {
				setNavigations(navigations => [...navigations, navigation]);
			} else {
				setNavigations([navigation]);
			}

			// Update navigation state after loading delay
			if (delayLoadingMs > 0) {
				setTimeout(() => {
					setNavigations(navigations => {
						let index = navigations.findIndex(navigation => navigation.detail === detail);
						if (index === -1) {
							return navigations;
						} else {
							return navigations.map((navigation, i) => (i !== index ? navigation : { ...navigation, loading: true }));
						}
					});
				}, delayLoadingMs);
			}

			let callbacks = { onAborted, onActionError, onNavigateEnd };
			let redirectedPage;
			let navigationPage = createPage(request, { cache: page.fresh && page, event, callbacks });

			// Fetches should set the page after the loaders to finish
			// Reloads and transitions should set the page almost immediatly

			try {
				let delayLoadingPromise = sleep(delayLoadingMs);

				if (navigationPage.actionPromise) {
					let actionResult = await Promise.race([navigationPage.promise, navigationPage.actionPromise]);
					if (actionResult instanceof Response && actionResult.status === 303) {
						let location = actionResult.headers.get('location');
						let redirect = new Request(location);
						redirectedPage = createPage(redirect, { event, callbacks }); // TODO: Should use cache here? I assume not
					}
				}

				// Setting a function as state allows late binding to the action result
				if (typeof state === 'function') {
					state = await state(navigationPage.action?.resource.result);
				}

				// Change this after the state update function because we need the old navigationPage action to update the state
				if (redirectedPage) {
					navigationPage = redirectedPage;
				}

				if (sticky === true || intent === FETCH) {
					await Promise.race([navigationPage.promise, navigationPage.loadersPromise]);
				} else if (typeof sticky === 'number') {
					let stickyPromise = sleep(sticky);
					let stickyLoadingPromise = Promise.all([delayLoadingPromise, stickyPromise]);

					await Promise.race([navigationPage.promise, navigationPage.loadersPromise, stickyLoadingPromise]);
				} else {
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
						if (loader.resource.scheduler) {
							resetScheduler(loader.resource.scheduler, { delayLoadingMs: 0 });
						}
					}
				}

				createTransition(sticky === 'transition', () => {
					historyRef.current = { type, state };

					setNavigations(navigations => navigations.filter(navigation => navigation.detail !== detail));
					setPage(navigationPage, () => {
						// Update history after navigationPage
						if (native && nativeHistory) {
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

							// The temporary historyRef is no longer valid as the native history was updated
							historyRef.current = undefined;
						}

						onNavigateEnd?.(event, navigationPage.action?.resource.result);
						onRouterNavigateEndCallback(event);
					});
				});
			} catch (error) {
				// We use a promise to bail out if needed (ie abort), but this is not an error,
				// so we catch it and do nothing if the page was intentionally aborted
				let pageIsAborted = await isResolved(navigationPage.promise);
				if (pageIsAborted === false) {
					throw error;
				}
			}
		});

		let abort = useImmutableCallback(abortedNavigations => {
			let abortedDetails;
			if (abortedNavigations == undefined) {
				abortedDetails = navigations.map(navigation => navigation.detail);
			} else if (abortedNavigations instanceof Array) {
				abortedDetails = abortedNavigations.map(navigation => navigation.detail);
			} else {
				abortedDetails = [abortedNavigations.detail];
			}

			historyRef.current = undefined;
			setPage(page);
			setNavigations(navigations.filter(navigation => !abortedDetails.includes(navigation.detail)));

			let nextPage = nextRef.current;
			if (nextPage && abortedDetails.includes(nextPage.event?.detail)) {
				abortPage(nextPage, `Navigation to "${nextPage.render.request.url}" was aborted`);
			}

			for (let page of pagesRef.current) {
				if (abortedDetails.includes(page.event?.detail)) {
					abortPage(page, `Navigation to "${page.render.request.url}" was aborted`);
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
				abortPage(previousPage, page.render.request);
			}

			pageRef.current = page;
			nextRef.current = undefined;
		}, [page, pageRef, nextRef, abortPage]);

		// Update page on popstate
		// Use insertion effect in case someone navigates with the history in a useEffect or useLayoutEffect
		// as child effects are run before parent effects
		useInsertionEffect(() => {
			if (native && nativeWindow) {
				function handlePopstate() {
					let cachedPage;
					let currentPage = pageRef.current;

					// The current page could also have the latest data if popstate happens to be to the same url.
					// The current page itself will never be in cache as caching could only happen when navigating away.
					// So first check current page, and only then find cached data in the back/forward cached pages.
					let request = new Request(nativeWindow.location);
					if (request.url === currentPage.render.request.url) {
						cachedPage = currentPage;
					} else {
						cachedPage = cacheRef.current.findLast(page => page?.render.request.url === request.url && page.fresh);
					}

					let nativePage = createPage(request, { cache: cachedPage });

					historyRef.current = undefined;
					setPage(nativePage);
				}

				nativeWindow.addEventListener('popstate', handlePopstate);

				return function () {
					nativeWindow.removeEventListener('popstate', handlePopstate);
				};
			}
		}, [pageRef, native]);

		// Update resources to prevent spinner flicker on newly rendered page
		useLayoutEffect(() => {
			for (let loader of page.loaders) {
				if (loader.resource.status === 'busy') {
					resetScheduler(loader.resource.scheduler, { delayLoadingMs: 0 });
				}
			}
		}, [page]);

		// Change url in case page was redirect
		useEffect(() => {
			if (native && nativeHistory) {
				nativeHistory.replaceState(nativeHistory.state, nativeDocument.title, page.render.request.url);
			}
		}, [page, native]);

		let routerContextValue = useMemo(() => ({ navigate, abort, dismiss, subscribe }), [navigate, abort, dismiss, subscribe]);

		let optionsContextValue = useMemo(() => {
			return { delayLoadingMs, minimumLoadingMs, defaultFormMethod };
		}, [delayLoadingMs, minimumLoadingMs, defaultFormMethod]);

		return (
			<routerContext.Provider value={routerContextValue}>
				<optionsContext.Provider value={optionsContextValue}>
					<navigationsContext.Provider value={navigations}>
						<pageActionContext.Provider value={page.action}>
							<pageLoadersContext.Provider value={page.loaders}>
								<historyContext.Provider value={history}>
									<errorsContext.Provider value={errors}>
										<locationContext.Provider value={location}>{elements}</locationContext.Provider>
									</errorsContext.Provider>
								</historyContext.Provider>
							</pageLoadersContext.Provider>
						</pageActionContext.Provider>
					</navigationsContext.Provider>
				</optionsContext.Provider>
			</routerContext.Provider>
		);

		function createPage(requested, options) {
			let { cache: pageCache, event, callbacks } = options ?? {};

			let fresh = true;
			let render = createRender(config, requested);
			let method = render.request.method.toLowerCase();

			let result = { fresh, render, event, callbacks };

			result.promise = createPromise();
			result.actionPromise = createActionPromise();
			result.loadersPromise = createLoadersPromise();

			result.promise.catch(() => {});

			let nextPage = nextRef.current;
			if (nextPage) {
				abortPage(nextPage, requested);
			}

			let intent = event?.detail.intent;
			if (intent === FETCH) {
				nextRef.current = undefined;
				pagesRef.current.push(result);
			} else {
				for (let page of pagesRef.current) {
					abortPage(page, requested);
				}

				pagesRef.current = [];
				nextRef.current = result;
			}

			function createActionPromise() {
				if (method === GET) {
					result.timestamp = performance.now();
				} else if (method === POST) {
					let mounted = mountedRef.current;
					if (mounted) {
						page.fresh = false;
					}

					let nextPage = nextRef.current;
					if (nextPage) {
						nextPage.fresh = false;
					}

					for (let page of pagesRef.current) {
						if (page) {
							page.fresh = false;
						}
					}

					for (let page of cacheRef.current) {
						if (page) {
							page.fresh = false;
						}
					}

					let scheduler = createScheduler({ delayLoadingMs, minimumLoadingMs });

					result.action = createAction(render, { event, scheduler, dataTransform });

					return Promise.race([result.promise, event ? result.action?.resource.promise : result.action?.promise])
						.catch(error => {
							if (event) {
								callbacks?.onActionError?.(event, error);
								onRouterActionErrorCallback(event, error);

								setNavigations(navigations => navigations.filter(navigation => navigation.detail !== event.detail));

								let registerError = errorConsumerCountRef.current && !event.defaultPrevented;
								if (registerError) {
									setErrors(errors => [...errors, error]);
								}
							}
							throw error;
						})
						.finally(() => {
							result.timestamp = performance.now();
						});
				}
			}

			async function createLoadersPromise() {
				let cache;
				let caching = method !== POST && render.request.cache !== 'reload' && render.request.cache !== 'no-store';
				if (caching && pageCache) {
					cache = pageCache;
				}

				let action = result.actionPromise;
				let scheduler = createScheduler({ delayLoadingMs, minimumLoadingMs });

				result.loaders = createLoaders(render, { action, cache, scheduler });

				try {
					let loaderPromises = result.loaders.map(loader => loader.resource.promise);
					let loaderResults = await Promise.race([result.promise, Promise.allSettled(loaderPromises)]);

					pagesRef.current = pagesRef.current.filter(page => page !== result);

					for (let page of pagesRef.current) {
						if (page.timestamp == undefined) continue;
						if (page.timestamp < result.timestamp) {
							abortPage(page, `Out of order HTTP request`);
						}
					}

					return loaderResults;
				} catch (error) {
					if (process.env.NODE_ENV) {
						console.warn(error);
					}
				}
			}

			return result;
		}
	};
}
