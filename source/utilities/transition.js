import { startTransition } from 'react';
import { flushSync } from 'react-dom';

// We use flushSync because React sometimes waits a little
// for suspended components when a state update is set from an async
// handler. This makes managing delayLoadingMs and minimumLoadingMs really difficult.
// So we tell react to immediately udpate state with flushSync

// We use setTimeout to schedule the update in the next tick.
// This is needed to allow loaders that depend on the actionPromise to resolve within 1 tick
// before the new page is rendered so a loading indicator is not flashed because of
// an already resolved loader

export default function transition(sticky, func) {
	setTimeout(() => {
		if (sticky) {
			startTransition(func);
		} else {
			flushSync(func);
		}
	}, 0);
}
