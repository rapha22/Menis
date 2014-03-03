function Hero()
{
	DisplayObject.call(this, "hero");

	this.aceleracaoX = 0;
	this.aceleracaoY = 0;
	this.power = 0;
	this.direction = "right";
	this.frameDelay = 3;
	var speed = 2;
		
	function getPlayerAnimations()
	{
		var animations = {};

		//Standing
		animations.stand = {};
		animations.stand.right = new SpritesheetAnimation("img/stand_right.png", 102, 100);
		animations.stand.left = new SpritesheetAnimation("img/stand_left.png", 102, 100);
		
		//Running
		animations.run = {};
		animations.run.right = new SpritesheetAnimation("img/run_right.png", 102, 100);
		animations.run.left = new SpritesheetAnimation("img/run_left.png", 102, 100);


		//Shoryuken
		animations.shoryuken = {};

		animations.shoryuken.right = new SpritesheetAnimation("img/shoryuken_right.png", 102, 100);
		animations.shoryuken.right.actions[5] = function() { this.firing = false; };
		animations.shoryuken.right.actions[8] = function() { this.isAnimating = false; };
		
		animations.shoryuken.left = new SpritesheetAnimation("img/shoryuken_left.png", 102, 100);
		animations.shoryuken.left.actions[5] = function() { this.firing = false; };
		animations.shoryuken.left.actions[8] = function() { this.isAnimating = false; };

		//Power fire
		animations.powerFire = {};
		animations.powerFire.right = new SpritesheetAnimation("img/power_right.png", 102, 100);
		animations.powerFire.right.actions[6] = function() { this.fire(); };
		animations.powerFire.right.actions[7] = function() { this.firing = false; this.isAnimating = false; };

		animations.powerFire.left = new SpritesheetAnimation("img/power_left.png", 102, 100);
		animations.powerFire.left.actions[6] = function() { this.fire(); };
		animations.powerFire.left.actions[7] = function() { this.firing = false; this.isAnimating = false; };
		
		return animations;
	}
	
	this.fire = function() 
	{ 
		$root.addChild(new Fireball(this)); 
	}
	
	this.onKeyDown = function(key)
	{				
		if (this.firing) return;

		if (!$key.isDown($key.SPACE))
		{
			this.isAnimating = true;
			
			if ($key.isDown($key.UP) && !this.jumping)
			{
				this.aceleracaoY = -20;
				this.jumping = true;
			}
				
			return;
		}
		
		this.firing = true;
		this.frameIndex = 0;
		this.reverseAnimation = false;
		this.setAnimation(this.jumping ? this.animations.shoryuken[this.direction] : this.animations.powerFire[this.direction]);
		this.frameDelay = 1;
		
		if (this.jumping)
			this.aceleracaoY = -20;
	}

	this.onEnterFrame = function()
	{
		this.x += this.aceleracaoX;
		this.y += this.aceleracaoY;

		if ($key.isDown($key.RIGHT)) this.aceleracaoX += speed;
		if ($key.isDown($key.LEFT)) this.aceleracaoX -= speed;
		
		//Verifica se o heróia está colidindo com o cenário
		if (this.y + this.height > $root.height)
		{
			this.y = $root.height - this.height;
			this.aceleracaoY = 0;
			
			if (this.jumping && this.firing)	
			{					
				this.isAnimating = true;
				this.firing = false;
			}
			
			this.jumping = false;
		}
		
		if (this.x < 0)
		{
			this.x = 0;
			this.aceleracaoX *= -1;
		}
		else if (this.x + this.width > $root.width)
		{
			this.x = $root.width - this.width - 1;
			this.aceleracaoX *= -1;				
		}

		
		//Controla as animações de corrida e parado
		if (!this.firing && !this.jumping)
		{
			if (this.aceleracaoX || this.aceleracaoY)
			{
				this.setAnimation(this.animations.run[this.direction]);
				var delayer = Math.abs(this.aceleracaoX);
				this.frameDelay = (!delayer) ? 5 : Math.floor(speed / Math.max(delayer / 5, 1));
			}
			else
			{
				this.frameDelay = 4;
				this.setAnimation(this.animations.stand[this.direction]);
			}
		}

		//Controle a direção do herói
		if (this.aceleracaoX > 0)
		{
			this.direction = "right";					
			this.aceleracaoX = Math.max(this.aceleracaoX - (!this.firing ? 1 : this.jumping ? 1 : 5), 0);
		}
		else if (this.aceleracaoX < 0)
		{
			this.direction = "left";
			this.aceleracaoX = Math.min(this.aceleracaoX + (!this.firing ? 1 : this.jumping ? 1 : 5), 0);
		}

		//Controle de gravidade
		this.aceleracaoY += 2;
		
		if (Math.abs(this.aceleracaoY) > 100)
			this.aceleracaoY = this.aceleracaoY < 0 ? -100 : 100;
			
		//Faz o shoryuken destruir os obstátulos
		if (this.jumping && this.firing)
		{
			for(var i = 0; i < $root.obstacles.length; i++)
			{
				var obs = $root.obstacles[i];
				if (this.hitTest(obs))
					obs.hit = true;
			}
		}
		
		//Faz a animação ser revertida
		if (this.frameIndex == this.getFramesCount() - 1)
			this.reverseAnimation = true;
		else if (this.frameIndex == 0)
			this.reverseAnimation = false;
	}
	
	this.animations = getPlayerAnimations();
}