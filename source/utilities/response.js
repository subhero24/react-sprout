export async function createData(response) {
	if (response.ok) {
		let data;
		let contentType = response.headers.get('content-type');
		if (contentType) {
			if (contentType.includes('application/json')) {
				data = await response.json();
			} else if (contentType.includes('multipart/form-data')) {
				data = await response.formData();
			} else if (contentType.includes('text/plain')) {
				data = await response.text();
			} else if (contentType.includes('application/octet-stream')) {
				data = await response.blob();
			} else {
				data = await response.arrayBuffer();
			}

			return data;
		}
	} else {
		throw response;
	}
}
