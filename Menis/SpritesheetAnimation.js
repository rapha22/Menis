import Animation from './Animation.js'
import resourceManager from './ResourceManager.js'

export function SpritesheetAnimation(spritesheetSource, spriteWidth, spriteHeight) {
	var _spritesheet = resourceManager.getResource(spritesheetSource);

	this.actions = [];

	this.initialize = function (entity)
	{
		entity.setSize(spriteWidth, spriteHeight);
	};

	this.drawFrame = function (renderer, entity, frameIndex)
	{
		if (!_spritesheet || !_spritesheet.src) return;

		renderer.getGraphics().drawImage(
			_spritesheet,
			spriteWidth * frameIndex,
			0,
			spriteWidth,
			spriteHeight,
			0,
			0,
			spriteWidth,
			spriteHeight
		);

		return this.actions[frameIndex];
	};

	this.getFramesCount = function ()
	{
		return ~~(_spritesheet.width / spriteWidth);
	};
};

SpritesheetAnimation.prototype = new Animation();

export function sprite(url, width, height, inits, actions) {
	var anim = new SpritesheetAnimation(url, width, height);
	Object.assign(anim, inits);
	Object.assign(anim.actions, actions);
	return anim;
};