import { joinPaths, pathParts } from './path.js';

import { isEquivalentObject } from './object.js';

export function resolveDescriptors(...descriptors) {
	let result;
	for (let descriptor of descriptors) {
		if (descriptor == undefined) continue;

		let descriptorHasLeadingSlash = descriptor.startsWith('/');
		if (descriptorHasLeadingSlash) {
			result = descriptor;
		} else {
			result = joinPaths(result, descriptor);
		}
	}
	return result;
}

export function interpolateDescriptor(descriptor, params = {}, splat = []) {
	if (descriptor == undefined) return;

	let [pathname, search = '', hash = ''] = pathParts(descriptor);

	let segments = [];
	for (let segment of pathname.split('/')) {
		if (isSplatSegment(segment)) {
			segments.push(...splat);
		} else if (isParamSegment(segment)) {
			segments.push(params[segment.slice(1)] ?? '');
		} else {
			segments.push(segment);
		}
	}

	return segments.join('/') + search + hash;
}

export function matchDescriptor(descriptor, pathname, strict = false) {
	let pathnameHasTrailingSlash = pathname.endsWith('/');
	let descriptorHasTrailingSlash = descriptor.endsWith('/');

	if (strict && pathnameHasTrailingSlash !== descriptorHasTrailingSlash) return;

	let pathnameParts = pathname.split('/').slice(1, pathnameHasTrailingSlash ? -1 : undefined);
	let descriptorParts = descriptor.split('/').slice(1, descriptorHasTrailingSlash ? -1 : undefined);

	let root;
	let rest;
	let base;
	let splat;
	let params = {};

	let pathnamePartIndex = 0;
	for (let descriptorPartIndex = 0; descriptorPartIndex < descriptorParts.length; descriptorPartIndex++) {
		let descriptorPart = descriptorParts[descriptorPartIndex];

		if (isDotSegment(descriptorPart)) {
			continue;
		} else if (isDotDotSegment(descriptorPart)) {
			pathnamePartIndex--;
		} else {
			let pathnamePart = pathnameParts[pathnamePartIndex];
			if (pathnamePart == undefined) return;

			if (isStaticSegment(descriptorPart)) {
				if (pathnamePart !== descriptorPart) return;
			} else if (isParamSegment(descriptorPart)) {
				let paramName = descriptorPart.slice(1);
				if (paramName.length) {
					params[paramName] = pathnamePart;
				}
			} else if (isSplatSegment(descriptorPart)) {
				base = base ?? '/' + pathnameParts.slice(0, pathnamePartIndex).join('/');
				splat = splat ?? pathnameParts.slice(pathnamePartIndex);
				pathnamePartIndex = pathnameParts.length - 1;
			}
			pathnamePartIndex++;
		}
	}

	let complete = pathnamePartIndex === pathnameParts.length;
	if (complete || strict === false) {
		root = '/' + pathnameParts.slice(0, pathnamePartIndex).join('/');
		rest = pathnameParts.slice(pathnamePartIndex);
		base = base ?? root;

		return { root, base, rest, splat, params };
	}
}

export function isSplatSegment(segment) {
	return segment === '*';
}

export function isDotSegment(segment) {
	return segment === '.';
}

export function isDotDotSegment(segment) {
	return segment === '..';
}

export function isParamSegment(segment) {
	return segment.startsWith(':');
}

export function isStaticSegment(segment) {
	return /^([^:*].*)?$/.test(segment);
}

export function isAssignedSearchParam(searchparam) {
	return /^([^=]+=.+)$/.test(searchparam);
}

export function isPresentSearchParam(searchparam) {
	return /^([^=]+=)$/.test(searchparam);
}

export function descriptorScore(descriptor) {
	if (descriptor == undefined) return [];

	let [pathname, search] = pathParts(descriptor);

	let segments = pathname.split('/');
	let searchParams = search?.slice(1).split('&') ?? [];

	let splat = segments.find(isSplatSegment) ? 1 : 0;
	let params = segments.filter(isParamSegment);
	let statics = segments.filter(isStaticSegment);

	let hasLeadingSlash = descriptor.startsWith('/') ? 1 : 0;
	let hasTrailingSlash = descriptor.endsWith('/') ? 1 : 0;

	let presentSearchParams = searchParams.filter(isPresentSearchParam);
	let assignedSearchParams = searchParams.filter(isAssignedSearchParam);

	return [
		hasLeadingSlash,
		segments.length,
		statics.length,
		params.length,
		splat,
		hasTrailingSlash,
		assignedSearchParams.length,
		presentSearchParams.length,
		searchParams.length,
	];
}

export function descriptorStructure(descriptor) {
	let [pathname, search] = pathParts(descriptor);

	let searchParams = search?.slice(1).split('&') ?? [];
	let searchParamsPresent = searchParams.filter(isPresentSearchParam);
	let searchParamsAssigned = searchParams.filter(isAssignedSearchParam);
	let segments = pathname.split('/').map(segment => {
		if (isParamSegment(segment)) return 1;
		if (isSplatSegment(segment)) return 2;
		return segment;
	});

	let presentSearchParams = new Set(searchParamsPresent);
	let assignedSearchParams = new Set(searchParamsAssigned);

	return { segments, presentSearchParams, assignedSearchParams };
}

export function equivalentDescriptors(descriptor1, descriptor2) {
	let structure1 = typeof descriptor1 === 'string' ? descriptorStructure(descriptor1) : descriptor1;
	let structure2 = typeof descriptor2 === 'string' ? descriptorStructure(descriptor2) : descriptor2;

	return (
		isEquivalentObject(structure1.segments, structure2.segments) &&
		isEquivalentObject(structure1.presentSearchParams, structure2.presentSearchParams) &&
		isEquivalentObject(structure1.assignedSearchParams, structure2.assignedSearchParams)
	);
}
