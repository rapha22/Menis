JSLoader = new function ()
{
	var _syncQueue = [];
	var _syncLoading = false;

	this.loadScripts = function (urls, callback, async)
	{
		if (async)
		{
			var loaded = urls.length;

			urls.forEach(function (url)
			{
				addScriptTag(url, function () { if (!--loaded && callback) callback(); });
			});
		}
		else
		{
			_syncQueue.push({ urls: urls, callback: callback });

			if (!_syncLoading)
				loadSyncQueue(_syncQueue.shift());
		}
	};

	function addScriptTag(url, callback)
	{
		var scriptTag = document.createElement("script");
		scriptTag.type = "text/javascript";
		scriptTag.async = false;
		scriptTag.src = url;

		scriptTag.onload = callback;

		document.getElementsByTagName("head")[0].appendChild(scriptTag);
	}

	function loadSyncQueue(queueItem)
	{
		_syncLoading = true;

		var loaded = queueItem.urls.length;

		function loadSync(url)
		{
			addScriptTag(url, function ()
			{
				if (!--loaded)
				{
					if (queueItem.callback) queueItem.callback();

					if (_syncQueue.length)
						loadSyncQueue(_syncQueue.shift());
					else
						_syncLoading = false;

					return;
				}

				loadSync(queueItem.urls.shift());
			});
		}

		loadSync(queueItem.urls.shift());
	}

}();