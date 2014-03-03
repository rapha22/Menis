function Text(text)
{
	DisplayObject.call(this);
	
	var $this = this;
	
	this.text = text;
	this.fontName = null;
	this.fontSize = null;
	this.color = "#000000";

	var anim = new CodeAnimation();
	anim.drawingFunctions.push(function(o)
	{
		if (!o.text) return;
	
		$graphs.textBaseline = "top";
		$graphs.translate(o.x, o.y);
		$graphs.font = o.fontSize + " " + o.fontName;
		$graphs.fillStyle = o.color;
		$graphs.fillText(o.text, 0, 0);
	});
	this.setAnimation(anim);
}