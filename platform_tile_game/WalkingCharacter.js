function WalkingCharacter()
{
	DisplayObject.call(this, "hero");
	
	var $this = this;
	
	var xAcc = 0;
	var yAcc = 0;
	
	var speed = 4;
	var jumpForce = 30;
	var easing = 0.9;
	
	this.width = 40;
	this.height = 60;
	
	var anim = new ImageAnimation();
	anim.frames = ["sonic.png"];
	this.setAnimation(anim);
	
	this.onKeyDown = function ()
	{
		if ($key.isDown($key.UP))
		{
			yAcc -= jumpForce;
		}
	};

	this.onEnterFrame = function()
	{
		if ($key.isDown($key.LEFT)) xAcc -= speed;
		else if ($key.isDown($key.RIGHT)) xAcc += speed;

		var nextX = getNextX();
		var nextY = getNextY();
		
		var xTile = Math.floor((this.x + this.width / 2) / Tile.size);
		var yTile = Math.floor((this.y + this.height) / Tile.size) - 1;		
		var currentTile = Level.getTile(xTile, yTile);
		
		if (getXDirection() == "right")
		{
			if (!currentTile || currentTile.rightY == 0)
			{		
				var hitTile = Level.getClosestTileAtRight(xTile, yTile) || currentTile;
				
				if (hitTile && nextX >= hitTile.x && !hitTile.angle)
				{
					$tracker2.track(hitTile.tileX, hitTile.tileY);
				
					setFaceX(hitTile.x - 1);
					xAcc = 0;
				}
			}
		}
		else
		{
			if (!currentTile || currentTile.leftY == 0)
			{
				var hitTile = Level.getClosestTileAtLeft(xTile, yTile) || currentTile;
				
				if (hitTile && nextX <= hitTile.x + hitTile.width && !hitTile.angle)
				{
					$tracker2.track(hitTile.tileX, hitTile.tileY);				
					
					setFaceX(hitTile.x + hitTile.width + 1);
					xAcc = 0;
				}
			}
		}		
		
		this.x += xAcc;
		
		//Bottom		
		if (getYDirection() == "down")
		{
			xTile = Math.floor((this.x + this.width / 2) / Tile.size);
			yTile = Math.floor((this.y + this.height) / Tile.size) - 1;
			currentTile = Level.getTile(xTile, yTile);
		
			var hitTile = currentTile || Level.getClosestTileAtBottom(xTile, yTile);
			
			currentAngle = 0;
			
			if (hitTile)
			{
				currentAngle = hitTile.angle;
			
				if (hitTile.angle)
				{
					//var extraGravity = hitTile.angle * speed;
					//xAcc += extraGravity * (yAcc < 0 ? -1 : 1);
				
					var t = Math.max((this.x + this.width / 2 - hitTile.x) / hitTile.width, 0);
					var aux = Math.floor((1 - t) * (hitTile.leftY) + t * hitTile.rightY);
					
					if (nextY >= aux)
					{
						setFaceY(aux);
						yAcc = 0;
					}
				}
				else if (nextY >= hitTile.y)
				{
					setFaceY(hitTile.y);
					yAcc = 0;
				}
			}
		}
		else
		{
			xTile = Math.floor((this.x + this.width / 2) / Tile.size);
			yTile = Math.floor(this.y / Tile.size) - 1;
			currentTile = Level.getTile(xTile, yTile);
			
			$tracker.track(xTile, yTile);
		
			var hitTile = currentTile || Level.getClosestTileAtTop(xTile, yTile);
			
			if (hitTile && nextY <= hitTile.y + hitTile.height)
			{
				setFaceY(hitTile.y + hitTile.height + 1);
				yAcc = 0;
			}
		}
		
		this.y += yAcc;
		
		yAcc += Globals.gravity;
		
		xAcc *= easing;
		yAcc *= easing;
	}
	
	function getTopHitTile(xTile, yTyle)
	{
		var hitTile = null;
	}
	
	function getFaceX()
	{
		if (xAcc >= 0)
			return $this.x + $this.width;
			
		return $this.x;
	}
	
	function getFaceY()
	{
		if (yAcc >= 0)
			return $this.y + $this.height;
			
		return $this.y;
	}
	
	function getFaceX()
	{
		if (xAcc >= 0)
			return $this.x + $this.width;
			
		return $this.x;
	}
	
	function getYDirection()
	{
		if (yAcc >= 0) return "down";
		return "up";
	}
	
	function getXDirection()
	{
		if (xAcc >= 0) return "right";
		return "left";
	}
	
	function getNextX()
	{
		return getFaceX() + xAcc;
	}

	function getNextY()
	{
		return getFaceY() + yAcc;
	}
	
	function setFaceX(value)
	{
		if (getXDirection() == "left") 
			$this.x = value;
		else 
			$this.x = value - $this.width;
	}
	
	function setFaceY(value)
	{
		if (getYDirection() == "up") 
			$this.y = value;
		else 
			$this.y = value - $this.height;
	}
}