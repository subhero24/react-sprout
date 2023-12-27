let nativeWindow;
try {
	nativeWindow = window;
} catch (error) {
	let isReferenceError = error instanceof ReferenceError;
	if (isReferenceError === false) {
		throw error;
	}
}

export { nativeWindow };
