function Camera(target, width, height)
{
	var self = this;

	this.x = 0;
	this.y = 0;
	this.width = width;
	this.height = height;
	
	$root.draw = function (buffer, mainCanvas, graphs)
	{
		var x = self.x;
		var y = self.y;
		var width = self.width || mainCanvas.width;
		var height = self.height || mainCanvas.height;
		
		if (target)
		{
			x = target.x - width / 2;
			y = target.y - height / 2;
		}
		
		x = Math.max(x, 0);
		y = Math.max(y, 0);
		
		x = Math.min(x, buffer.width - width);
		y = Math.min(y, buffer.height - height);
		
		graphs.drawImage(
			buffer,
			x,
			y,
			width,
			height,
			0,
			0,
			mainCanvas.width,
			mainCanvas.height
		);
	};
}