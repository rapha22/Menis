function CodeAnimation()
{
	var $this = this;
	this.drawingFunctions = [];
	this.actions = [];

	this.drawFrame = function(displayObject)
	{		
		if (!this.drawingFunctions || this.drawingFunctions.length == 0) return;		
		
		this.drawingFunctions[displayObject.frameIndex](displayObject);		
		return this.actions[displayObject.frameIndex];
	}
	
	this.getFramesCount = function()
	{
		return this.drawingFunctions.length;
	}
}