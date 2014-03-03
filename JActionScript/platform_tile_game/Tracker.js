function Tracker(color, onOff)
{
	DisplayObject.call(this);
	
	var $this = this;
	
	this.onOff = onOff

	this.width = Tile.size;
	this.height = Tile.size;
	
	this.tileX = 0;
	this.tileY = 0;

	var animation = new CodeAnimation();
	animation.drawingFunctions.push(function (obj)
	{
		if (!$this.onOff) return;
	
		$graphs.fillStyle = color;
		$graphs.fillRect($this.x, $this.y, Tile.size, Tile.size);
		
		$graphs.font = "11px sans-serif";
		$graphs.fillText($this.tileX + "/" + $this.tileY, $this.x, $this.y);
	});
	
	this.setAnimation(animation);
	
	this.track = function (x, y)
	{
		this.x = x * Tile.size;
		this.y = y * Tile.size;
		
		this.tileX = x;
		this.tileY = y;
	}
}