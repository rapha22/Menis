Menis.ImageAnimation = function (urls)
{
	if (typeof urls === "string") urls = [urls];

	if (!Array.isArray(urls) | !urls.length)
		throw new TypeError("An image animation must be buit with an array of at least one image URL.");

	this.urls = urls;
};

Menis.ImageAnimation.prototype = new Menis.Animation();

Menis.ImageAnimation.prototype.drawFrame = function (entity)
{
	var img = Menis.resourceManager.getImage(
		this.urls[this.frameIndex]
	);

	entity.setSize(img.width, img.height);

	Menis.renderer.getGraphics().drawImage(img, 0, 0);
};

Menis.ImageAnimation.prototype.getFramesCount = function ()
{
	return this.urls.length;
};
