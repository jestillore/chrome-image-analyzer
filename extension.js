
function getReadableSize(bytes) {
	var thresh = 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

chrome.tabs.query({
	active: true,
	currentWindow: true
}, function (tabs) {
	var currentTab = tabs[0];
	
	chrome.runtime.sendMessage({
		command: 'getImages',
		tabId: currentTab.id
	}, function (images) {

		$('#count').text(images.length);

		var contents = $('#images');
		contents.empty();
		var total = 0;
		images.forEach(function (image) {
			total += image.sizeInBytes * 1;

			var row = $(`<tr>
				<td><a href="${image.url}" target="_blank">${image.fileName}</a></td>
				<td>${image.fileType}</td>
				<td>${getReadableSize(image.sizeInBytes)}</td>
			</tr>`);
			contents.append(row);
		});

		$('#total').text(getReadableSize(total));

	});

});
