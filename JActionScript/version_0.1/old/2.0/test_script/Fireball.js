function Fireball(origin)
{
	DisplayObject.call(this);
	
	var $this = this;
	var right = origin.direction == "right";

	function initialize()
	{		
		$this.x = origin.x + (right ? origin.width : -origin.width);
		$this.y = origin.y + origin.height / 2 - 20;
		
		var animationSufix = origin.direction + ".png";
		
		$this.setAnimation(new SpritesheetAnimation("img/hadouken_" + animationSufix, 42, 40));
		
		$this.explodeAnimation = new SpritesheetAnimation("img/power_explode_" + animationSufix, 42, 40);
		$this.explodeAnimation.actions[2] = function()
		{
			$root.removeChild(this.id);
		};
	}
	
	this.explode = function()
	{
		this.setAnimation(this.explodeAnimation);
		this.frameDelay = 1;
		this.exploded = true;
	}
	
	this.onEnterFrame = function()
	{
		if (this.exploded) return;
	
		for(var i = 0; i < $root.obstacles.length; i++)
		{
			var obs = $root.obstacles[i];
			if (this.hitTest(obs))
			{
				obs.hit = true;
				this.explode();
				return;
			}
		}
	
		if (this.x <= 0)
		{
			this.x = 0;
			this.explode();
			return;
		}
		else if (this.x + this.width >= $root.width)
		{
			this.x = $root.width - this.width;
			this.explode();
			return;						
		}
		
		this.x += right ? 25 : -25;
	}
	
	initialize();
}