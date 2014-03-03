function Hero()
{
	DisplayObject.call(this, "hero");

	this.aceleracaoX = 0;
	this.aceleracaoY = 0;
	this.power = 0;
	this.direction = "right";
	this.frameDelay = 3;
	this.jumping = true;
	
	var speed = 2;
		
	function getPlayerAnimations()
	{
		var animations = {};

		//Standing
		animations.stand = {};
		animations.stand.right = new SpritesheetAnimation("img/stand.png", 100, 100);
		animations.stand.left = new SpritesheetAnimation("img/stand_flipped.png", 100, 100);
		
		//Running
		animations.run = {};
		animations.run.right = new SpritesheetAnimation("img/run.png", 100, 100);
		animations.run.left = new SpritesheetAnimation("img/run_flipped.png", 100, 100);
		
		animations.jumping = {};
		animations.jumping.right = new ImageAnimation("img/jumping.png");
		animations.jumping.left = new ImageAnimation("img/jumping_flipped.png");


		//Shoryuken
		animations.shoryuken = {};

		animations.shoryuken.right = new SpritesheetAnimation("img/shoryuken.png", 100, 100);
		animations.shoryuken.right.actions[5] = function() { this.firing = false; };
		animations.shoryuken.right.actions[8] = function() { this.isAnimating = false; };
		
		animations.shoryuken.left = new SpritesheetAnimation("img/shoryuken_flipped.png", 100, 100);
		animations.shoryuken.left.actions[5] = function() { this.firing = false; };
		animations.shoryuken.left.actions[8] = function() { this.isAnimating = false; };

		//Power fire
		animations.powerFire = {};
		animations.powerFire.right = new SpritesheetAnimation("img/power.png", 100, 100);
		animations.powerFire.right.actions[6] = function() { this.fire(); };
		animations.powerFire.right.actions[7] = function() { this.firing = false; this.isAnimating = false; };

		animations.powerFire.left = new SpritesheetAnimation("img/power_flipped.png", 100, 100);
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
		
		if ($key.isDown($key.DOWN) && !this.jumping)
		{
			if (this.y + this.height < $root.height)
			{
				this.y += 2;
				return;
			}
		}

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

		if (!(!this.jumping && this.firing))
		{
			if ($key.isDown($key.RIGHT)) this.aceleracaoX += speed;
			if ($key.isDown($key.LEFT)) this.aceleracaoX -= speed;
		}
		
		//Verifica se o heróia está colidindo com o cenário
		if (this.y + this.height >= $root.height)
		{
			this.y = $root.height - this.height;
			this.stopJumping();
		}
		else
		{		
			var onPlataform = false;
		
			//Verifica se está colidindo com alguma plataforma
			for(var i = 0; i < $root.plataforms.length; i++)
			{
				var p = $root.plataforms[i];
				
				var nextMove = 
				{ 
					x: this.x + this.aceleracaoX,
					y: this.y + this.aceleracaoY,
					width: this.width,
					height: this.height,
				};
				
				if (Collisions.rectanglesOverlapsX(nextMove, p))
				{
					if (this.y + this.height <= p.y && Collisions.rectanglesOverlapsY(nextMove, p))
					{
						this.y = p.y - this.height;
						this.stopJumping();
						onPlataform = true;
						break;
					}
				}
			}
			
			if (!onPlataform)
				this.jumping = true;
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
		if (!this.firing)
		{
			if (!this.jumping)
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
			else
			{
				this.setAnimation(this.animations.jumping[this.direction]);
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

		if (this.jumping)
		{
			//Controle de gravidade
			this.aceleracaoY += 2;
			
			if (Math.abs(this.aceleracaoY) > 100)
				this.aceleracaoY = this.aceleracaoY < 0 ? -100 : 100;
		}
			
		//Faz o shoryuken destruir os obstátulos
		if (this.jumping && this.firing)
		{
			for(var i = 0; i < $root.enemies.length; i++)
			{
				var obs = $root.enemies[i];
				if (this.hitTest(obs))
					obs.hit = true;
			}
		}
		
		//Faz a animação ser revertida
		if (this.frameIndex == this.getFramesCount() - 1)
			this.reverseAnimation = true;
		else if (this.frameIndex == 0)
			this.reverseAnimation = false;
		
		/*		
		$graphs.strokeStyle = "#FFFF00";
		$graphs.rect(this.x, this.y, this.width, this.height);
		$graphs.stroke();
		*/
	}
	
	this.stopJumping = function()
	{
		this.aceleracaoY = 0;
		
		if (this.jumping && this.firing)	
		{
			this.isAnimating = true;
			this.firing = false;
		}
		
		this.jumping = false;	
	}
	
	this.animations = getPlayerAnimations();
}