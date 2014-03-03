function ImageAnimation()
{
	var $this = this;
	this.frames = [];

	this.drawFrame = function(displayObject)
	{		
		if (!this.frames || this.frames.length == 0) return;
		
		var picUrl;
		var frameIndex = displayObject.frameIndex;
		
		if (typeof($this.frames[frameIndex]) == 'string')
			picUrl = $this.frames[frameIndex];
		else
			picUrl = $this.frames[frameIndex].image;		
		
		var img = new Image();
		img.src = picUrl;
		
		displayObject.width = img.width;
		displayObject.height = img.height;
		
		window.$graphs.drawImage(
			img,
			displayObject.x,
			displayObject.y
		);
		
		if (typeof($this.frames[frameIndex]) != 'string')
			return $this.frames[frameIndex].action;
	}
	
	this.getFramesCount = function()
	{
		return this.frames.length;
	}
}