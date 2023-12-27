import { pathParts } from './path.js';

import { isEquivalentObject } from './object.js';

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

export function matchDescriptor(pathnameDescriptor, pathname, strict = false) {
	let pathnameParts = pathname.split('/').slice(1);
	let pathnameHasTrailingSlash = pathname.endsWith('/');

	let descriptorParts = pathnameDescriptor.split('/').slice(1);
	let descriptorHasTrailingSlash = pathnameDescriptor.endsWith('/');
	let descriptorHasTrailingSlashWithSplat = pathnameDescriptor.endsWith('*/');

	if (strict === true && pathnameHasTrailingSlash !== descriptorHasTrailingSlash) return;
	if (strict === false && descriptorHasTrailingSlashWithSplat && !pathnameHasTrailingSlash) return;

	let base;
	let rest;
	let splat;
	let match;
	let params = {};
	let pathnamePartIndex = 0;
	for (let descriptorPartIndex = 0; descriptorPartIndex < descriptorParts.length; descriptorPartIndex++) {
		let pathnamePart = pathnameParts[pathnamePartIndex];
		let descriptorPart = descriptorParts[descriptorPartIndex];

		if (pathnamePart == undefined) return;

		let isLastDescriptorPart = descriptorPartIndex === descriptorParts.length - 1;
		let isEmptyDescriptorPart = descriptorPart === '';
		if (isEmptyDescriptorPart && isLastDescriptorPart) break;

		if (isStaticSegment(descriptorPart)) {
			if (pathnamePart !== descriptorPart) return;
		} else if (isParamSegment(descriptorPart)) {
			let paramName = descriptorPart.slice(1);
			if (paramName.length) {
				params[paramName] = pathnamePart;
			}
		} else if (isSplatSegment(descriptorPart)) {
			let splatNeedsSlicing = pathnameHasTrailingSlash ? -1 : undefined;
			let matchNeedsSlicing = pathnameHasTrailingSlash && !descriptorHasTrailingSlash ? -1 : undefined;

			match = '/' + pathnameParts.slice(0, matchNeedsSlicing).join('/');
			splat = pathnameParts.slice(pathnamePartIndex, splatNeedsSlicing);
			break;
		}

		pathnamePartIndex++;
	}

	let complete = pathnamePartIndex === pathnameParts.length - (pathnameHasTrailingSlash ? 1 : 0);
	if (complete || splat != undefined || strict === false) {
		let restNeedsSlicing = pathnameHasTrailingSlash ? -1 : undefined;

		base = '/' + pathnameParts.slice(0, pathnamePartIndex).join('/');
		rest = pathnameParts.slice(pathnamePartIndex, restNeedsSlicing);
		match = match ?? base;

		return { base, pathname: match, rest, splat, params };
	}
}

export function isSplatSegment(segment) {
	return segment === '*';
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
