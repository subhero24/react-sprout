export async function createData(requestOrResponse) {
	let data;
	let contentType = requestOrResponse.headers.get('content-type');
	if (contentType) {
		if (contentType.includes('application/json')) {
			data = await requestOrResponse.json();
		} else if (contentType.includes('multipart/form-data')) {
			data = await requestOrResponse.formData();
		} else if (contentType.includes('application/x-www-form-urlencoded')) {
			data = new URLSearchParams(await requestOrResponse.text());
		} else if (contentType.includes('text/plain')) {
			data = await requestOrResponse.text();
		} else if (contentType.includes('text/html')) {
			data = await requestOrResponse.text();
		} else if (contentType.includes('application/octet-stream')) {
			data = await requestOrResponse.blob();
		} else {
			data = await requestOrResponse.arrayBuffer();
		}
	}

	return data;
}
