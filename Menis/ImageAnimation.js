Menis.ImageAnimation = function (urls, repeatX, repeatY) {
	if (typeof urls === "string") urls = [urls];

	if (!Array.isArray(urls) | !urls.length)
		throw new TypeError("An image animation must be buit with an array of at least one image URL.");

	this.urls = urls;
	this.repeatX = repeatX,
	this.repeatY = repeatY;
};

Menis.ImageAnimation.prototype = Object.create(Menis.Animation);

Menis.ImageAnimation.prototype.drawFrame = function (entity) {
	var img = Menis.resourceManager.getResource(
		this.urls[this.frameIndex]
	);

	if (!this.repeatX && !this.repeatY) {
		entity.setSize(img.width, img.height);
	}

	Menis.renderer.getGraphics().drawImage(img, 0, 0);
};

Menis.ImageAnimation.prototype.getFramesCount = function () {
	return this.urls.length;
};
