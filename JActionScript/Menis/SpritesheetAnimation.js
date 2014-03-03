Menis.SpritesheetAnimation = function (spritesheetSource, spriteWidth, spriteHeight)
{
	var _spritesheet = Menis.resourceManager.getImage(spritesheetSource);

	this.actions = [];

	this.drawFrame = function (entity, frameIndex)
	{
		if (!_spritesheet || !_spritesheet.src) return;

		entity.width = spriteWidth;
		entity.height = spriteHeight;

		Menis.renderer.getGraphics().drawImage(
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

Menis.SpritesheetAnimation.prototype = new Menis.Animation();