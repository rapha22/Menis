function Obstacle()
{
	DisplayObject.call(this);

	this.x 		= $root.width + 10;
	this.y 		= Math.round(Math.random() * $root.height);
	this.width 	= 50 + Math.round(Math.random() * 150);
	this.height = 50 + Math.round(Math.random() * 150);
	//this.alpha 	= 0.7;
	
	var r = 50 + Math.ceil(Math.random() * 205);
	var g = 50 + Math.ceil(Math.random() * 205);
	var b = 50 + Math.ceil(Math.random() * 205);
	
	var speed = 1 + Math.random() * 10;
	
	
	var anim = new CodeAnimation();
	anim.drawingFunctions.push(function(o)
	{		
		window.$graphs.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
		window.$graphs.fillRect(
			o.x, 
			o.y, 
			o.width,
			o.height
		);
	});	
	this.setAnimation(anim);
	
	this.onEnterFrame = function()
	{
		if (this.hit)
		{
		
			if (this.x + this.width > 0)
			{
				for(var y = 0; y < this.height; y += 5)
					for(var x = 0; x < this.width; x += 5)
						createParticle(this, x, y);
			}
				
			$root.obstacles.splice($root.obstacles.indexOf(this), 1);
			this.destroy();
			
			return;
		}
	
		this.x -= speed;
		
		if (this.x + this.width < 0)
			this.hit = true;
	}
	
	function createParticle(origin, x, y)
	{
		var p = new DisplayObject();
		
		var anim = new CodeAnimation();
		anim.drawingFunctions.push(function(o)
		{		
			window.$graphs.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
			window.$graphs.fillRect(
				o.x, 
				o.y, 
				o.width,
				o.height
			);
		});	

		
		p.setAnimation(anim);
		
		p.x 		= origin.x + x;
		p.y 		= origin.y + y;
		p.width 	= 2;
		p.height 	= 2;
		
		p.xaccell 	= Math.random() * (Math.random() < 0.5 ? -1 : 1) * 20;
		p.yaccell 	= -10;
		p.ySpeed 	= 1 + Math.random();
		
		p.onEnterFrame = function()
		{
			this.y += this.yaccell;
			this.yaccell += this.ySpeed;
			
			this.x += this.xaccell;
			this.xaccell *= 0.94;
			
			if (this.y > $root.height || this.x < 0 || this.x > $root.width)
				this.destroy();
		}
		
		$root.addChild(p);
	}
}