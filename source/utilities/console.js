import { Fragment } from 'react';
import { node, browser } from './environment.js';
import { childrenToArray } from './children.js';

import Redirect from '../components/redirect.jsx';

let blacklist = ['children'];

function attributeString(element, options) {
	let { blacklist, whitelist } = options;

	let string = '';
	for (let attribute in element.props) {
		if (blacklist != undefined && blacklist.includes(attribute) === true) continue;
		if (whitelist != undefined && whitelist.includes(attribute) === false) continue;

		let attributeValue = element.props[attribute];
		if (attributeValue) {
			if (typeof attributeValue === 'string') {
				string = string + ` ${attribute}="${attributeValue}"`;
			} else {
				string = string + ` ${attribute}={...}`;
			}
		}
	}
	return string;
}

function traverseElement(element, ...args) {
	let [level, callback] = args.length === 1 ? [0, ...args] : args;

	if (typeof element === 'string') {
		callback(element, level, element);
	} else {
		let type = element.type;
		if (type === Fragment) {
			type = '';
		} else if (type === Redirect) {
			// Redirect function name will be mangled by minification
			// so we set the type manually
			type = 'Redirect';
		} else {
			type = type.displayName ?? type.name ?? type;
		}

		let children = childrenToArray(element.props.children);
		let attributes = attributeString(element, { blacklist });

		if (children.length) {
			callback(`<${type}${attributes}>`, level, element);
			for (let child of children) traverseElement(child, level + 1, callback);
			callback(`</${type}>`, level);
		} else {
			callback(`<${type}${attributes} />`, level, element);
		}
	}
}

export let defaultConfigConsole = {
	warn: function (message, rootElement, elements = [], indentation = '\t') {
		let result = '';

		traverseElement(rootElement, function (text, level = 0, element) {
			let indent = indentation.repeat(level);
			let highlight = elements.includes(element);

			result = result + indent + (highlight ? `*${text}*` : text) + '\n';
		});

		console.warn(`${message}\n\n${result}`);
	},
};

export let browserConfigConsole = {
	warn: function (message, rootElement, elements = [], indentation = '\t') {
		let result = '';
		let styles = [];

		traverseElement(rootElement, function (text, level = 0, element) {
			let indent = indentation.repeat(level);
			let highlight = elements.includes(element);
			if (highlight) {
				result = result + indent + `%c${text}%c` + '\n';
				styles = [...styles, 'font-weight: bold', ''];
			} else {
				result = result + indent + text + '\n';
			}
		});

		console.warn(`${message}\n\n${result}`, ...styles);
	},
};

export let nodeConfigConsole = {
	warn: function (message, rootElement, elements = [], indentation = '    ') {
		let result = '';

		traverseElement(rootElement, function (text, level = 0, element) {
			let indent = indentation.repeat(level);
			let highlight = elements.includes(element);

			result = result + indent + (highlight ? `\x1b[0m${text}\x1b[2m` : text) + '\n';
		});

		console.warn(`${message}\n\n\x1b[2m${result}\x1b[0m`);
	},
};

let defaultConsole;
if (node) {
	defaultConsole = nodeConfigConsole;
} else if (browser) {
	defaultConsole = browserConfigConsole;
} else {
	defaultConsole = defaultConfigConsole;
}

export default defaultConsole;
