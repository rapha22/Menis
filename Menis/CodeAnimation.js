Menis.CodeAnimation = function (drawingFunctions) {
	if (typeof drawingFunctions === "function")
		this.drawingFunctions = [drawingFunctions];
	else
		this.drawingFunctions = drawingFunctions;
}

Menis.CodeAnimation.prototype = Object.create(Menis.Animation);

Menis.CodeAnimation.prototype.drawFrame = function (entity, frameIndex) {
	if (!this.drawingFunctions.length) return;

	this.drawingFunctions[frameIndex](Menis.renderer.getGraphics(), entity);
};

Menis.CodeAnimation.prototype.getFramesCount = function ()
{
	return this.drawingFunctions.length;
};