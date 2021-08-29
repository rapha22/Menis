import Animation from './Animation.js'

export default function CodeAnimation(drawingFunctions) {
	if (typeof drawingFunctions === "function")
		this.drawingFunctions = [drawingFunctions];
	else
		this.drawingFunctions = drawingFunctions;
}

CodeAnimation.prototype = new Animation();

CodeAnimation.prototype.drawFrame = function (renderer, entity, frameIndex)
{
	if (!this.drawingFunctions.length) return;

	this.drawingFunctions[frameIndex](renderer.getGraphics(), entity);
};

CodeAnimation.prototype.getFramesCount = function ()
{
	return this.drawingFunctions.length;
};