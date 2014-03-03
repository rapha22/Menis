function ResourceManager()
{
	var self = this;
	var resources = {};	
	var resourcesCount = 0;
	var loadedResourcesCount = 0;
	
	this.onLoadAll = null;
	
	
	this.getImage = function(url, loadCallback)
	{
		if (resources[url]) 
			return resources[url];
			
		resourcesCount++;
			
		var image = new Image();
		image.src = url;
		
		image.onload = function ()
		{
			resources[url] = image;
			
			if (loadCallback) loadCallback();
			
			self.imageLoaded();
		};
		
		resources[url] = image;
		
		return image;
	}
	
	this.loadResources = function(urls, callback)
	{
		for(var i in urls)
			this.getImage(urls[i], callback);
	}
	
	this.imageLoaded = function()
	{
		loadedResourcesCount++;
		
		if (loadedResourcesCount == resourcesCount && self.onLoadAll)
			self.onLoadAll();
	}
	
	this.getResourcesCount = function()
	{
		return resourcesCount;
	}
	
	this.getLoadedResourcesCount = function()
	{
		return loadedResourcesCount;
	}
	
	this.getLoadedResourcesRate = function()
	{
		return loadedResourcesCount / resourcesCount;
	}
};

if (!window.$resourceManager)
	window.$resourceManager = new ResourceManager();