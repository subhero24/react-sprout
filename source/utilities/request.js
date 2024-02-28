import { POST } from '../constants.js';

export async function createData(request) {
	let data;
	if (request.method === POST) {
		let contentType = request.headers.get('content-type');
		if (contentType) {
			if (contentType.includes('application/json')) {
				data = await request.json();
			} else if (contentType.includes('multipart/form-data')) {
				data = await request.formData();
			} else if (contentType.includes('application/x-www-form-urlencoded')) {
				data = new URLSearchParams(await request.text());
			} else if (contentType.includes('text/plain')) {
				data = await request.text();
			} else if (contentType.includes('application/octet-stream')) {
				data = await request.blob();
			} else {
				data = await request.arrayBuffer();
			}
		}
	}

	return data;
}
