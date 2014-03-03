function ImageAnimation(imageUrl)
{
	var $this = this;
	this.frames = [];
	
	if (imageUrl) this.frames.push(imageUrl);

	this.drawFrame = function(displayObject)
	{		
		if (!this.frames || this.frames.length == 0) return;
		
		var picUrl;
		var frameIndex = displayObject.frameIndex;
		
		if (typeof($this.frames[frameIndex]) == 'string')
			picUrl = $this.frames[frameIndex];
		else
			picUrl = $this.frames[frameIndex].image;		
		
		var img = window.$resourceManager.getImage(picUrl);
		
		displayObject.width = img.width;
		displayObject.height = img.height;
		
		window.$graphs.drawImage(
			img,
			displayObject.getAbsoluteX(),
			displayObject.getAbsoluteY()
		);
		
		if (typeof($this.frames[frameIndex]) != 'string')
			return $this.frames[frameIndex].action;
	}
	
	this.getFramesCount = function()
	{
		return this.frames.length;
	}
}