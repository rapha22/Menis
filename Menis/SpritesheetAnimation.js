Menis.SpritesheetAnimation = function (spritesheetSource, spriteWidth, spriteHeight, props)
{
	var _spritesheet = Menis.resourceManager.getResource(spritesheetSource);

	Menis.Observable(this);

	this.actions = [];

	this.initialize = function (entity) {
		entity.setSize(spriteWidth, spriteHeight);
	};

	this.drawFrame = function (entity, frameIndex) {
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

	this.getFramesCount = function () {
		return ~~(_spritesheet.width / spriteWidth);
	};

	Menis.Util.extend(this, props);
};

Menis.SpritesheetAnimation.prototype = Object.create(Menis.Animation);