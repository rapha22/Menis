import Animation from './Animation.js'
import resourceManager from './ResourceManager.js'

export function ImageAnimation(urls) {
	if (typeof urls === "string") urls = [urls];

	if (!Array.isArray(urls) | !urls.length)
		throw new TypeError("An image animation must be buit with an array of at least one image URL.");

	this.urls = urls;
};

ImageAnimation.prototype = new Animation();

ImageAnimation.prototype.drawFrame = function (renderer, entity)
{
	var img = resourceManager.getResource(
		this.urls[this.frameIndex]
	);

	entity.setSize(img.width, img.height);

	renderer.getGraphics().drawImage(img, 0, 0);
};

ImageAnimation.prototype.getFramesCount = function ()
{
	return this.urls.length;
};

export function image(url, inits, actions) {
	var anim = new ImageAnimation(url);
	Object.assign(anim, inits);
	Object.assign(anim.actions, actions);
	return anim;
};