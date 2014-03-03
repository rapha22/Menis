Menis.ResourceManager = function ()
{
	var self = this;

	Menis.Observable(self);

	var resources = Object.create(null);
	
	
	self.getImage = function (url, callback)
	{
		if (resources[url])
			return resources[url];

		var image = new Image();

		image.onload = function ()
		{
			resources[url] = image;

			self.trigger(Menis.Events.RESOURCE_LOADED, { loadedResource: image, success: true });

			if (callback) callback(image, true /* success */);
		};

		image.onerror = function ()
		{
			self.trigger(Menis.Events.RESOURCE_ERROR, { loadedResource: image, success: false });

			if (callback) callback(image, false /* no success */);
		};

		image.src = url;

		resources[url] = image;

		return image;
	};

	self.loadImages = function (urls, callback, progressCallback)
	{
		var count = urls.length;

		for (var i = 0, l = count; i < l; i++)
		{
			self.getImage(urls[i], function ()
			{
				if (!--count && callback) callback();
			});
		}
	};
}