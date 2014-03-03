function Enemy()
{
	DisplayObject.call(this);

	this.x = $root.width + 10;
	this.y = Math.round(Math.min(Math.random() * $root.height, $root.height - 100));
	
	this.setAnimation(new SpritesheetAnimation("img/enemy_flipped.png", 100, 100));
	
	this.frameDelay = 1;
	
	var speed = 1 + Math.round(Math.random() * 7);
	
	this.onEnterFrame = function()
	{
		if (this.hit)
		{
			if (this.x + this.width > 0)
			{
				var particlesSpacing = 5;
		
				for(var y = 0; y < this.height; y += particlesSpacing)
					for(var x = 0; x < this.width; x += particlesSpacing)
						createParticle(this, x, y);
			}
				
			$root.enemiesToSestroy.push(this);			
			return;
		}
	
		this.x -= speed;
		
		if (this.x + this.width < 0)
		{
			this.hit = true;
			$game.sandBar.current++;
		}
			
		//Faz a animação ser revertida
		if (this.frameIndex == this.getFramesCount() - 1)
			this.reverseAnimation = true;
		else if (this.frameIndex == 0)
			this.reverseAnimation = false;
	}
	
	function createParticle(origin, x, y)
	{
		var p = new DisplayObject();
		
		var anim = new CodeAnimation();
		anim.drawingFunctions.push(function(o)
		{		
			$graphs.fillStyle = "rgb(174, 151, 79)";
			$graphs.fillRect(
				o.x, 
				o.y, 
				o.width,
				o.height
			);
		});	

		
		p.setAnimation(anim);
		
		p.x 		= origin.x + x;
		p.y 		= origin.y + y;
		p.width 	= 1 + (Math.random() > 0.5 ? 1 : 0);
		p.height 	= p.width;
		
		p.xaccell 	= Math.random() * (Math.random() < 0.5 ? -1 : 1) * 25;
		p.yaccell 	= -5 - (Math.random() * 15);
		p.ySpeed 	= 1 + Math.random();
		
		p.onEnterFrame = function()
		{
			this.x += Math.round(this.xaccell);
			this.xaccell *= 0.94;
			
			this.y += Math.round(this.yaccell);
			this.yaccell += this.ySpeed;			
			
			if (this.y > $root.height || this.x < 0 || this.x > $root.width)
				this.destroy();
		}
		
		$root.addChild(p);
	}
}