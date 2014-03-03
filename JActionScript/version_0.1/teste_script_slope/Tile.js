function Tile(x, y, leftY, rightY)
{
	DisplayObject.call(this);
	
	Tile.size = 20;
	Tile.tiles = Tile.tiles || [];
	
	Tile.tiles.push(this);
	
	this.hit = false;

	var $this = this;
	
	this.tileX = x;
	this.tileY = y;
	this.x = x * Tile.size;
	this.y = y * Tile.size;
	this.width = Tile.size;
	this.height = Tile.size;
	
	this.leftY = this.y + leftY;
	this.rightY = this.y + rightY;
	
	leftY = leftY || 0;
	rightY = rightY || 0;
	
	this.angle = Math.atan2( (this.y + rightY) - (this.y + leftY), (this.x + this.width) - this.x );
	
	var animation = new CodeAnimation();
	animation.drawingFunctions.push(function (obj)
	{
		$graphs.fillStyle = $this.hit ? "#FF0000" : "#000000";
		
		if (leftY + rightY == 0)		
		{
			$graphs.fillRect($this.x, $this.y, Tile.size, Tile.size);
			return;
		}
		
		var topLeftY = $this.y + leftY;
		var topRightY = $this.y + rightY;
		
		$graphs.beginPath();
		$graphs.moveTo($this.x, topLeftY);
		$graphs.lineTo($this.x + Tile.size, topRightY);
		$graphs.lineTo($this.x + Tile.size, $this.y + $this.height);
		$graphs.lineTo($this.x, $this.y + $this.height);
		$graphs.fill();
		return;
		$graphs.strokeStyle = "#00FF00";
		$graphs.strokeRect($this.x, $this.y, $this.width, $this.height);
	});
	
	this.setAnimation(animation);	
}