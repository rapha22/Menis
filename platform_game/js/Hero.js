var Hero = Menis.Entity.specialize(function ()
{
	var self = this;

	self.powers = [];

	self.xAccel = 0;
	self.yAccel = 0;
	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;
	self.canMove = true;
	self.canJump = true;
	self.canChangeAnimation = true;

	var speed = 2;

	function getPlayerAnimations()
	{
		var animations = {};

		animations.stand   = Menis.easy.sprite("img_new/standing.png", 30, 48, { style: Menis.AnimationStyles.YOYO });
		animations.run     = Menis.easy.sprite("img_new/walking.png", 34, 48, { style: Menis.AnimationStyles.YOYO });
		animations.jumping = new Menis.ImageAnimation("img_new/falling.png");

		return animations;
	}

	Menis.easy.keydown(function (key)
	{
		if (Menis.key.isDown(Menis.key.DOWN, "D") && !self.jumping)
		{
			leapFromPlatform();
			return;
		}

		if (Menis.key.isDown("D") && !self.jumping)
		{
			self.jump();
		}
	});

	this.enterframe(function ()
	{
		for (var i = 0, l = this.powers.length; i < l; i++)
		{
			if (this.powers[i].execute(this)) break;
		}

		self.x += self.xAccel;
		self.y += self.yAccel;

		if (self.canMove)
		{
			if (Menis.key.isDown(Menis.key.RIGHT)) self.xAccel += speed;
			if (Menis.key.isDown(Menis.key.LEFT)) self.xAccel -= speed;
		}

		var groundY = null;

		//Verifica se o herói está colidindo com o cenário
		if (self.y + self.height >= Menis.root.height)
		{
			groundY = Menis.root.height;
			stopJumping();
		}
		else
		{
			var onPlataform = false;

			//Verifica se está colidindo com alguma plataforma
			for (var i = 0; i < Menis.root.plataforms.length; i++)
			{
				var p = Menis.root.plataforms[i];

				var nextMove =
				{
					left:   self.x + self.xAccel,
					top:    self.y + self.yAccel,
					right:  self.x + self.xAccel + self.width,
					bottom: self.y + self.yAccel + self.height
				};

				if (Menis.Collisions.rectanglesOverlapsX(nextMove, p.getRectangle()))
				{
					if (self.y + self.height <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p.getRectangle()))
					{
						groundY = p.y;
						stopJumping();
						break;
					}
				}
			}

			if (groundY === null) //If we don't have a plataform to stand, then we are jumping/falling
				self.jumping = true;
		}

		if (self.x < 0)
		{
			self.x = 0;
			self.xAccel *= -1;
		}
		else if (self.x + self.width > Menis.root.width)
		{
			self.x = Menis.root.width - self.width - 1;
			self.xAccel *= -1;
		}


		//Controla as animações de corrida e parado
		if (self.canChangeAnimation)
		{
			if (!self.jumping)
			{
				if (self.xAccel)
				{
					self.setAnimation(self.animations.run, true);
					var delayer = Math.abs(self.xAccel);
					self.getAnimation().frameDelay = (!delayer) ? 5 : Math.floor(speed / Math.max(delayer / 5, 1));
				}
				else
				{
					self.setAnimation(self.animations.stand, true).frameDelay = 4;
				}
			}
			else
			{
				self.setAnimation(self.animations.jumping, true);
			}
		}

		//Direction and speed control
		if (self.xAccel > 0)
		{
			self.direction = "right";
			self.xAccel = Math.max(self.xAccel - (!self.firing ? 1 : self.jumping ? 1 : 5), 0);
		}
		else if (self.xAccel < 0)
		{
			self.direction = "left";
			self.xAccel = Math.min(self.xAccel + (!self.firing ? 1 : self.jumping ? 1 : 5), 0);
		}

		if (self.jumping)
		{			
			self.yAccel += 2; //Gravity

			if (Math.abs(self.yAccel) > 100)
				self.yAccel = self.yAccel < 0 ? -100 : 100;
		}

		this.getAnimation().flipHorizontally = self.direction === "left"; //If facing left, flip

		if (groundY !== null) this.y = groundY - this.height;
	});

	self.jump = function ()
	{
		if (!self.canJump) return;

		self.jumping = true;
		self.yAccel = -20;
	}

	function stopJumping()
	{
		self.yAccel = 0;
		self.jumping = false;
	}

	function leapFromPlatform()
	{
		if (self.y + self.height < Menis.root.height)
		{
			self.y += 2;
		}
	}


	self.animations = getPlayerAnimations();
	self.scale(1.5, 1.5);

	self.powers.push(hadouken());
	self.powers.push(shoryuken());
});