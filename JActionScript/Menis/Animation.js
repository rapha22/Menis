Menis.Animation = function (entity)
{
	this._animationStyleFunc = null;

	this.frameDelay       = 0;
	this.frameIndex       = 0;
	this._frameDelayAux   = 0;
	this.isAnimating      = true;
	this.reverseAnimation = false;
	this.actions          = [];
	this.drawFrame        = null;
	this.style            = Menis.AnimationStyles.NORMAL;
	this.flipHorizontally = false;
	this.flipVertically   = false;
};

Menis.Animation.prototype = new function ()
{
	this.getFramesCount = function ()
	{
		return (this.getFrameCount && this.getFrameCount()) || 0;
	};

	this.animate = function (entity)
	{
		if (!this.isAnimating) return;


		var g = Menis.renderer.getGraphics();

		if (this.flipHorizontally)
		{	
			g.translate(entity.width, 0);
			g.scale(-1, 1);
		}

		if (this.flipVertically)
		{
			g.translate(0, entity.height);
			g.scale(1, -1);
		}


		this.drawFrame(entity, this.frameIndex);

		
		if (this._frameDelayAux < this.frameDelay)
		{
			this._frameDelayAux++;
			return;
		}

		this._frameDelayAux = 0;


		if (typeof this.actions[this.frameIndex] === "function")
		{
			this.actions[this.frameIndex]();
		}

		if (!this._animationStyleFunc)
			this._animationStyleFunc = Menis.AnimationStyles.getAnimationStyleFunc(this.style);

		this.frameIndex = this._animationStyleFunc(this.frameIndex, this.getFramesCount());
	};

}();


Menis.AnimationStyles =
{
	NORMAL:  "normal",
	REVERSE: "reverse",
	YOYO:    "yoyo",


	getAnimationStyleFunc: function (style)
	{
		return this.factories[style]();
	},


	factories:
	{
		"normal": function ()
		{
			return function (frameIndex, frameCount) { return (frameIndex + 1) % frameCount; };
		},

		"reverse": function ()
		{
			return function (frameIndex, frameCount)
			{
				frameIndex--;

				if (frameIndex < 0)
					return Math.max(frameCount - 1, 0);

				return frameIndex;
			};
		},

		"yoyo": function ()
		{
			var incrementer = 1;

			return function (frameIndex, frameCount)
			{
				frameIndex += incrementer;

				if (frameIndex <= 0 || frameIndex >= frameCount - 1)
					incrementer *= -1;

				return frameIndex;
			};
		}
	}
};