import Routes, { useResolve } from '../../../source/index.js';

function Parent(props) {
	let resolve = useResolve();

	return (
		<>
			<div id="a-relative-dot">{resolve('.')}</div>
			<div id="a-relative-dot-slash">{resolve('./')}</div>
			<div id="a-relative-dot-part">{resolve('./x')}</div>
			<div id="a-relative-dots">{resolve('..')}</div>
			<div id="a-relative-dots-slash">{resolve('../')}</div>
			<div id="a-relative-dots-part">{resolve('../x')}</div>
			<div id="a-relative-dots-part-slash">{resolve('../x/')}</div>
			<div id="a-relative-absolute">{resolve('/')}</div>
			<div id="a-relative-absolute-part">{resolve('/x')}</div>
			<div id="a-relative-part">{resolve('x')}</div>
			<div id="a-relative-parts">{resolve('x/y')}</div>

			<div id="a-dot">{resolve('.', { relative: false })}</div>
			<div id="a-dot-slash">{resolve('./', { relative: false })}</div>
			<div id="a-dot-part">{resolve('./x', { relative: false })}</div>
			<div id="a-dots">{resolve('..', { relative: false })}</div>
			<div id="a-dots-slash">{resolve('../', { relative: false })}</div>
			<div id="a-dots-part">{resolve('../x', { relative: false })}</div>
			<div id="a-dots-part-slash">{resolve('../x/', { relative: false })}</div>
			<div id="a-absolute">{resolve('/', { relative: false })}</div>
			<div id="a-absolute-part">{resolve('/x', { relative: false })}</div>
			<div id="a-part">{resolve('x', { relative: false })}</div>
			<div id="a-parts">{resolve('x/y', { relative: false })}</div>

			<div>{props.children}</div>
		</>
	);
}

function Child() {
	let resolve = useResolve();

	return (
		<>
			<div id="b-relative-dot">{resolve('.')}</div>
			<div id="b-relative-dot-slash">{resolve('./')}</div>
			<div id="b-relative-dot-part">{resolve('./x')}</div>
			<div id="b-relative-dots">{resolve('..')}</div>
			<div id="b-relative-dots-slash">{resolve('../')}</div>
			<div id="b-relative-dots-part">{resolve('../x')}</div>
			<div id="b-relative-dots-part-slash">{resolve('../x/')}</div>
			<div id="b-relative-absolute">{resolve('/')}</div>
			<div id="b-relative-absolute-part">{resolve('/x')}</div>
			<div id="b-relative-part">{resolve('x')}</div>
			<div id="b-relative-parts">{resolve('x/y')}</div>

			<div id="b-dot">{resolve('.', { relative: false })}</div>
			<div id="b-dot-slash">{resolve('./', { relative: false })}</div>
			<div id="b-dot-part">{resolve('./x', { relative: false })}</div>
			<div id="b-dots">{resolve('..', { relative: false })}</div>
			<div id="b-dots-slash">{resolve('../', { relative: false })}</div>
			<div id="b-dots-part">{resolve('../x', { relative: false })}</div>
			<div id="b-dots-part-slash">{resolve('../x/', { relative: false })}</div>
			<div id="b-absolute">{resolve('/', { relative: false })}</div>
			<div id="b-absolute-part">{resolve('/x', { relative: false })}</div>
			<div id="b-part">{resolve('x', { relative: false })}</div>
			<div id="b-parts">{resolve('x/y', { relative: false })}</div>
		</>
	);
}

let Router = Routes(
	<Parent path="a">
		<Child path="b/*" />
	</Parent>,
);

export default Router;
