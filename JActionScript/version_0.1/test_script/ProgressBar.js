function ProgressBar()
{
	DisplayObject.call(this);
	
	var text = new Text("LOADING...");
	text.fontName = "Helvetica";
	text.fontSize = "70pt";
	text.color = "#CC0000"
	text.x = 20;
	text.Y = 20;
	this.addChild(text);	
	
	var anim = new CodeAnimation();
	anim.drawingFunctions.push(function(o)
	{	
		$graphs.fillRect(0, 0, $root.width, $root.height);
		
		$graphs.strokeStyle = "#FFFFFF";
		$graphs.rect($root.width / 2 - 200, $root.height / 2 - 10, 400, 20);
		$graphs.stroke();
		
		$graphs.fillStyle = "#CC0000";
		$graphs.fillRect($root.width / 2 - 195, $root.height / 2 - 7, 390 *  $resourceManager.getLoadedResourcesRate(), 14);
	});
	this.setAnimation(anim);	
}