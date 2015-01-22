Menis.CodeAnimation = function (drawingFunctions)
{
	if (typeof drawingFunctions === "function")
		this.drawingFunctions = [drawingFunctions];
	else
		this.drawingFunctions = drawingFunctions;


	this.drawFrame = function (entity, frameIndex)
	{
		if (!drawingFunctions.length) return;

		this.drawingFunctions[frameIndex](Menis.renderer.getGraphics(), entity);
	};
	
	this.getFramesCount = function ()
	{
		return this.drawingFunctions.length;
	};
}

Menis.CodeAnimation.prototype = new Menis.Animation();