import useRouter from './use-router';

export default function useAbort() {
	let router = useRouter();
	if (router == undefined) {
		throw new Error(`The useAbort hook can only be used inside a Router component.`);
	}

	return router.abortNavigation;
}
