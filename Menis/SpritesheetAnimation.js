Menis.SpritesheetAnimation = function (spritesheetSource, spriteWidth, spriteHeight)
{
	var _spritesheet = Menis.resourceManager.getResource(spritesheetSource);

	this.actions = [];

	this.initialize = function (entity)
	{
		entity.setSize(spriteWidth, spriteHeight);
	};

	this.drawFrame = function (entity, frameIndex)
	{
		if (!_spritesheet || !_spritesheet.src) return;

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

Menis.sprite = function (url, width, height, inits, actions)
{
	var anim = new Menis.SpritesheetAnimation(url, width, height);
	Menis._.fill(anim, inits);
	Menis._.fill(anim.actions, actions);
	return anim;
};