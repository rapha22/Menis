import Observable from './Observable.js'
import Events from './Events.js'

export default new function ResourceManager() {
	var self = this;

	Observable(self);

	var resources = Object.create(null);
	
	
	self.getResource = function (url, callback)
	{
		if (resources[url])
			return resources[url];

		var image = new Image();

		image.onload = function ()
		{
			resources[url] = image;

			self.trigger(Events.RESOURCE_LOADED, { loadedResource: image, success: true });

			if (callback) callback(image, true /* success */);
		};

		image.onerror = function ()
		{
			self.trigger(Events.RESOURCE_ERROR, { loadedResource: image, success: false });

			if (callback) callback(image, false /* no success */);
		};

		image.src = url;

		resources[url] = image;

		return image;
	};

	self.loadResources = function (urls, callback, progressCallback)
	{
		var count = urls.length;

		for (var i = 0, l = count; i < l; i++)
		{
			self.getResource(urls[i], function ()
			{
				if (!--count && callback) callback();
			});
		}
	};
}