Menis.Ajax = new function Ajax() {
	this.load = function (url, successCallback, errorCallback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readystate !== XMLHttpRequest.DONE) return;
			if (xhr.status === 200) successCallback(xhr.responseText, xhr);
			else errorCallback(xhr);
		};
		xhr.open(url);
	}
};