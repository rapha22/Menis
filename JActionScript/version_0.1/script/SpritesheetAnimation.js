function SpritesheetAnimation(spritesheetSource, spriteWidth, spriteHeight)
{
	this.spritesheet = window.$resourceManager.getImage(spritesheetSource);
	
	this.actions = [];

	this.drawFrame = function(displayObject)
	{		
		if (!this.spritesheet || !this.spritesheet.src) return;
		
		var frameIndex = displayObject.frameIndex;
		
		displayObject.width = spriteWidth;
		displayObject.height = spriteHeight;
		
		window.$graphs.drawImage(
			this.spritesheet,
			spriteWidth * frameIndex,
			0,
			spriteWidth,
			spriteHeight,
			displayObject.getAbsoluteX(),
			displayObject.getAbsoluteY(),
			spriteWidth,
			spriteHeight
		);
		
		return this.actions[frameIndex];			
	};
	
	this.getFramesCount = function()
	{
		return Math.round(this.spritesheet.width / spriteWidth);
	};
}