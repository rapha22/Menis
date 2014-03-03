Hero = Menis.Entity.specialize(function ()
{
	var self = this;

	self.aceleracaoX = 0;
	self.aceleracaoY = 0;
	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;

	var speed = 2;

	function getPlayerAnimations()
	{
		var animations = {};

		//Standing
		animations.stand = {};
		animations.stand.right = Menis.Reflection.create(Menis.SpritesheetAnimation, "platform_game/img/stand.png", 100, 100, { style: Menis.AnimationStyles.YOYO });
		animations.stand.left = Menis.Reflection.create(Menis.SpritesheetAnimation, "platform_game/img/stand_flipped.png", 100, 100, { style: Menis.AnimationStyles.YOYO });

		//Running
		animations.run = {};
		animations.run.right = Menis.Reflection.create(Menis.SpritesheetAnimation, "platform_game/img/run.png", 100, 100, { style: Menis.AnimationStyles.YOYO });
		animations.run.left = Menis.Reflection.create(Menis.SpritesheetAnimation, "platform_game/img/run_flipped.png", 100, 100, { style: Menis.AnimationStyles.YOYO });

		animations.jumping = {};
		animations.jumping.right = new Menis.ImageAnimation("platform_game/img/jumping.png");
		animations.jumping.left = new Menis.ImageAnimation("platform_game/img/jumping_flipped.png");


		//Shoryuken
		animations.shoryuken = {};

		animations.shoryuken.right = new Menis.SpritesheetAnimation("platform_game/img/shoryuken.png", 100, 100);
		animations.shoryuken.right.actions[5] = function () { self.firing = false; };
		animations.shoryuken.right.actions[8] = function () { self.isAnimating = false; };

		animations.shoryuken.left = new Menis.SpritesheetAnimation("platform_game/img/shoryuken_flipped.png", 100, 100);
		animations.shoryuken.left.actions[5] = function () { self.firing = false; };
		animations.shoryuken.left.actions[8] = function () { self.isAnimating = false; };

		//Power fire
		animations.powerFire = {};
		animations.powerFire.right = new Menis.SpritesheetAnimation("platform_game/img/power.png", 100, 100);
		animations.powerFire.right.actions[6] = function () { self.fire(); };
		animations.powerFire.right.actions[7] = function () { self.firing = false; self.isAnimating = false; };

		animations.powerFire.left = new Menis.SpritesheetAnimation("platform_game/img/power_flipped.png", 100, 100);
		animations.powerFire.left.actions[6] = function () { self.fire(); };
		animations.powerFire.left.actions[7] = function () { self.firing = false; self.isAnimating = false; };

		return animations;
	}

	self.fire = function ()
	{
		Menis.root.addChild(new Fireball(self));
	}

	Menis.key.addEventHandler(Menis.Events.KEY_DOWN, function (key)
	{
		if (self.firing) return;

		if (Menis.key.isDown(Menis.key.DOWN) && !self.jumping)
		{
			if (self.y + self.height < Menis.root.height)
			{
				self.y += 2;
				return;
			}
		}

		if (!Menis.key.isDown(Menis.key.SPACE))
		{
			self.animation.isAnimating = true;

			if (Menis.key.isDown(Menis.key.UP) && !self.jumping)
			{
				self.aceleracaoY = -20;
				self.jumping = true;
			}

			return;
		}

		self.firing = true;
		self.animation = self.jumping ? self.animations.shoryuken[self.direction] : self.animations.powerFire[self.direction];

		if (self.jumping)
			self.aceleracaoY = -20;
	});

	this.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		self.x += self.aceleracaoX;
		self.y += self.aceleracaoY;

		if (!(!self.jumping && self.firing))
		{
			if (Menis.key.isDown(Menis.key.RIGHT)) self.aceleracaoX += speed;
			if (Menis.key.isDown(Menis.key.LEFT)) self.aceleracaoX -= speed;
		}

		//Verifica se o heróia está colidindo com o cenário
		if (self.y + self.height >= Menis.root.height)
		{
			self.y = Menis.root.height - self.height;
			self.stopJumping();
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
					x: self.x + self.aceleracaoX,
					y: self.y + self.aceleracaoY,
					width: self.width,
					height: self.height,
				};

				if (Menis.Collisions.rectanglesOverlapsX(nextMove, p))
				{
					if (self.y + self.height <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p))
					{
						self.y = p.y - self.height;
						self.stopJumping();
						onPlataform = true;
						break;
					}
				}
			}

			if (!onPlataform)
				self.jumping = true;
		}

		if (self.x < 0)
		{
			self.x = 0;
			self.aceleracaoX *= -1;
		}
		else if (self.x + self.width > Menis.root.width)
		{
			self.x = Menis.root.width - self.width - 1;
			self.aceleracaoX *= -1;
		}


		//Controla as animações de corrida e parado
		if (!self.firing)
		{
			if (!self.jumping)
			{
				if (self.aceleracaoX || self.aceleracaoY)
				{
					self.animation = self.animations.run[self.direction];
					var delayer = Math.abs(self.aceleracaoX);
					self.animation.frameDelay = (!delayer) ? 5 : Math.floor(speed / Math.max(delayer / 5, 1));
				}
				else
				{
					self.animation = self.animations.stand[self.direction];
					self.animation.frameDelay = 4;
				}
			}
			else
			{
				self.animation = self.animations.jumping[self.direction];
			}
		}

		//Controle a direção do herói
		if (self.aceleracaoX > 0)
		{
			self.direction = "right";
			self.aceleracaoX = Math.max(self.aceleracaoX - (!self.firing ? 1 : self.jumping ? 1 : 5), 0);
		}
		else if (self.aceleracaoX < 0)
		{
			self.direction = "left";
			self.aceleracaoX = Math.min(self.aceleracaoX + (!self.firing ? 1 : self.jumping ? 1 : 5), 0);
		}

		if (self.jumping)
		{
			//Controle de gravidade
			self.aceleracaoY += 2;

			if (Math.abs(self.aceleracaoY) > 100)
				self.aceleracaoY = self.aceleracaoY < 0 ? -100 : 100;
		}

		//Faz o shoryuken destruir os obstátulos
		if (self.jumping && self.firing)
		{
			for (var i = 0; i < Menis.root.enemies.length; i++)
			{
				var obs = Menis.root.enemies[i];
				if (self.hitTest(obs))
					obs.hit = true;
			}
		}

		/*		
		$graphs.strokeStyle = "#FFFF00";
		$graphs.rect(self.x, self.y, self.width, self.height);
		$graphs.stroke();
		*/
	});

	self.stopJumping = function ()
	{
		self.aceleracaoY = 0;

		if (self.jumping && self.firing)
		{
			self.isAnimating = true;
			self.firing = false;
		}

		self.jumping = false;
	}

	self.animations = getPlayerAnimations();
});