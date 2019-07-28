
var images = {};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	switch (message.command) {
		case 'getImages':
			sendResponse(images[message.tabId] || []);
	}
});

function getFileName(url) {
	return url.split('/').pop();
}

function getFileType(url) {
	var fileName = getFileName(url);
	var extension = fileName.split('.').pop().toLowerCase();
	switch (extension) {
		case 'png':
			return 'PNG';
		case 'jpeg':
		case 'jpg':
			return 'JPEG';
		case 'gif':
			return 'GIF';
	}
}

function getContentLength(headers) {
	for (var i = 0; i < headers.length; i++) {
		var header = headers[i];
		if (header.name.toLowerCase() === 'content-length') {
			return header.value;
		}
	}
	return 0;
}

chrome.webRequest.onHeadersReceived.addListener(function (details) {
	if (details.statusCode === 200) {
		if (!images[details.tabId]) {
			images[details.tabId] = [];
		}

		var image = {
			url: details.url,
			fileName: getFileName(details.url),
			fileType: getFileType(details.url),
			sizeInBytes: getContentLength(details.responseHeaders) * 1
		};
		images[details.tabId].push(image);
	}
}, {
	urls: [
		'https://*/*.png',
		'http://*/*.png',
		'https://*/*.jpg',
		'http://*/*.jpg',
		'https://*/*.jpeg',
		'http://*/*.jpeg',
		'https://*/*.gif',
		'http://*/*.gif',
	]
}, [
	'responseHeaders'
]);

chrome.tabs.onRemoved.addListener(function (tabId, info) {
	delete images[tabId];
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	if (changeInfo.status === 'loading') {
		delete images[tabId];
	}
});
