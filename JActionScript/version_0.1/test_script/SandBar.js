function SandBar()
{
	DisplayObject.call(this);
	
	this.max = 20;
	this.current = 0;
	
	var anim = new CodeAnimation();
	anim.drawingFunctions.push(function(o)
	{
		var perc = o.current / o.max;
	
		$graphs.fillStyle = perc < 0.6 ? "rgba(0, 0, 0, 0.7)" : perc < 0.8 ? "rgba(120, 80, 0, 0.7)" : "rgba(255, 0, 0, 0.7)";
		$graphs.fillRect(5, 5, 300, 20);
		
		$graphs.fillStyle = "rgb(199, 183, 135)";
		$graphs.fillRect(5, 5, Math.floor(300 * perc), 20);
		
		$graphs.strokeStyle = perc < 0.6 ? "#000000" : perc < 0.8 ? "#FFAA00" : "#FF0000";
		$graphs.rect(5, 5, 300, 20);
		$graphs.stroke();
	});
	this.setAnimation(anim);
	
	this.onEnterFrame = function()
	{
		if (this.current >= this.max && this.onFull)
			this.onFull();
	};
}