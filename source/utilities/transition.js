import { startTransition } from 'react';

export default function transition(sticky, func) {
	if (sticky) {
		startTransition(func);
	} else {
		func();
	}
}
