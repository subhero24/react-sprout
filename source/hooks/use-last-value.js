import useLastValueRef from './use-last-value-ref.js';

export default function useLastValue(value) {
	return useLastValueRef(value).current;
}
