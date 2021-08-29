import * as AnimationStyles from './AnimationStyles.js'

export default function Animation() {
	this.actions = [];
};

Animation.prototype = new function () {
	this._animationStyleFunc = null;

	this.frameDelay       = 0;
	this.frameIndex       = 0;
	this._frameDelayAux   = 0;
	this.reverseAnimation = false;
	this.drawFrame        = null;
	this.initialize       = null;
	this.style            = AnimationStyles.NORMAL;
	this.flipHorizontally = false;
	this.flipVertically   = false;
	this._playing         = true;
	this.visible          = true;

	this.getFramesCount = function ()
	{
		return (this.getFrameCount && this.getFrameCount()) || 0;
	};

	this.animate = function (renderer, entity)
	{
		if (!this.visible) return;

		var g = renderer.getGraphics();

		if (this.flipHorizontally)
		{	
			var xScale = 1 / entity._scaleX;

			g.scale(xScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale (scale's behaviour is a cummulative).

			g.translate(entity.width, 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
		}

		if (this.flipVertically)
		{
			var yScale = 1 / entity._scaleY;

			g.scale(yScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale (scale's behaviour is a cummulative).

			g.translate(entity.height, 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
		}


		this.drawFrame(renderer, entity, this.frameIndex);

		
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
			this._animationStyleFunc = AnimationStyles.getAnimationStyleFunc(this.style);

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