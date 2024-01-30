import { useState } from 'react';

// A state is used to keep track of the dependencies because a ref will not work.
// Refs need to be changed in an effect, but the effect will not run because of the state update from render.
// This will not cause extra renders anyway since the state and dependencies always change at the same time.

export default function useDerivedState(callback, deps) {
	let [state, setState] = useState(callback);
	let [dependencies, setDependencies] = useState(deps);

	let depsChange = deps?.length !== dependencies?.length || deps.some((d, i) => !Object.is(d, dependencies[i]));
	if (depsChange) {
		setState(callback);
		setDependencies(deps);
	}

	return [state, setState];
}
