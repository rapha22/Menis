Menis.Animation = function (entity)
{
	this._animationStyleFunc = null;

	this.frameDelay       = 0;
	this.frameIndex       = 0;
	this._frameDelayAux   = 0;
	this.reverseAnimation = false;
	this.actions          = [];
	this.drawFrame        = null;
	this.initialize       = null;
	this.style            = Menis.AnimationStyles.NORMAL;
	this.flipHorizontally = false;
	this.flipVertically   = false;
	this._playing         = true;
	this.visible          = true;
};

Menis.Animation.prototype = new function ()
{
	this.getFramesCount = function ()
	{
		return (this.getFrameCount && this.getFrameCount()) || 0;
	};

	this.animate = function (entity)
	{
		if (!this.visible) return;

		var g = Menis.renderer.getGraphics();

		if (this.flipHorizontally)
		{	
			var xScale = 1 / entity._scaleX;

			g.scale(xScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale.

			g.translate(entity.getWidth(), 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
		}

		if (this.flipVertically)
		{
			var yScale = 1 / entity._scaleY;

			g.scale(yScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale.

			g.translate(entity.getHeight(), 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
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
			this.actions[this.frameIndex].call(this, entity);
		}

		if (!this._playing) return;

		if (!this._animationStyleFunc)
			this._animationStyleFunc = Menis.AnimationStyles.getAnimationStyleFunc(this.style);

		this.frameIndex = this._animationStyleFunc(this.frameIndex, this.getFramesCount());
	};

	this.isPlaying = function ()
	{
		return this._playing;
	};

	this.play = function ()
	{
		this._playing = true;
	};	

	this.stop = function ()
	{
		this._playing = false;
	};

	this.restart = function ()
	{
		this.frameIndex = 0;
		this._frameDelayAux = 0;

		this.play();
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