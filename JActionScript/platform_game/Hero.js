Hero = Menis.Entity.specialize(function ()
{
	var self = this;

	var _powerParticles = [];

	self.aceleracaoX = 0;
	self.aceleracaoY = 0;
	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;
	self.hadoukenPower = 0;

	var speed = 2;

	function getPlayerAnimations()
	{
		var animations = {};

		animations.stand = Menis.Reflection.create(Menis.SpritesheetAnimation, "platform_game/img/stand.png", 100, 100, { style: Menis.AnimationStyles.YOYO });
		animations.run = Menis.Reflection.create(Menis.SpritesheetAnimation, "platform_game/img/run.png", 100, 100, { style: Menis.AnimationStyles.YOYO });
		animations.jumping = new Menis.ImageAnimation("platform_game/img/jumping.png");


		//Shoryuken
		animations.shoryuken = new Menis.SpritesheetAnimation("platform_game/img/shoryuken.png", 100, 100);
		animations.shoryuken.actions[5] = function () { self.firing = false; };
		animations.shoryuken.actions[8] = function () { this.stop(); };


		//Power fire
		animations.powerCharge = new Menis.SpritesheetAnimation("platform_game/img/power_charge.png", 100, 100);
		animations.powerCharge.actions[1] = function () { this.stop(); };

		animations.powerShot = new Menis.SpritesheetAnimation("platform_game/img/power_fire.png", 100, 100);
		animations.powerShot.actions[1] = function ()
		{
			Menis.root.addChild(new Fireball(self, self.hadoukenPower));
			self.hadoukenPower = 0;
		};
		animations.powerShot.actions[3] = function () { self.firing = false; };

		return animations;
	}

	Menis.key.addEventHandler(Menis.Events.KEY_DOWN, function (key)
	{
		if (self.firing || self.powerCharging) return;

		if (Menis.key.isDown("S"))
		{
			if (self.jumping)
				shoryuken();
			else
				chargeHadouken();

			return;
		}

		if (Menis.key.isDown(Menis.key.DOWN, "D") && !self.jumping)
		{
			leapFromPlatform();
			return;
		}

		if (Menis.key.isDown("D") && !self.jumping)
		{
			jump();
		}
	});

	Menis.key.addEventHandler(Menis.Events.KEY_UP, function (e)
	{
		if (Menis.key.equals(e.keyCode, "S") && self.powerCharging)
		{
			shotHadouken();
		}
	});

	this.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		self.x += self.aceleracaoX;
		self.y += self.aceleracaoY;

		if (self.powerCharging)
			self.hadoukenPower = Math.min(100, self.hadoukenPower + 1);

		if (!self.firing && !self.powerCharging)
		{
			if (Menis.key.isDown(Menis.key.RIGHT)) self.aceleracaoX += speed;
			if (Menis.key.isDown(Menis.key.LEFT)) self.aceleracaoX -= speed;
		}

		//Verifica se o heróia está colidindo com o cenário
		if (self.y + self.getHeight() >= Menis.root.getHeight())
		{
			self.y = Menis.root.getHeight() - self.getHeight();
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
					left:   self.x + self.aceleracaoX,
					top:    self.y + self.aceleracaoY,
					right:  self.x + self.aceleracaoX + self.getWidth(),
					bottom: self.y + self.aceleracaoY + self.getHeight()
				};

				if (Menis.Collisions.rectanglesOverlapsX(nextMove, p.getRectangle()))
				{
					if (self.y + self.getHeight() <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p.getRectangle()))
					{
						self.y = p.y - self.getHeight();
						stopJumping();
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
		else if (self.x + self.getWidth() > Menis.root.getWidth())
		{
			self.x = Menis.root.getWidth() - self.getWidth() - 1;
			self.aceleracaoX *= -1;
		}


		//Controla as animações de corrida e parado
		if (!self.firing && !self.powerCharging)
		{
			if (!self.jumping)
			{
				if (self.aceleracaoX || self.aceleracaoY)
				{
					self.setAnimation(self.animations.run, true);
					var delayer = Math.abs(self.aceleracaoX);
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

		this.getAnimation().flipHorizontally = self.direction === "left";

		/*		
		$graphs.strokeStyle = "#FFFF00";
		$graphs.rect(self.x, self.y, self.getWidth(), self.getHeight());
		$graphs.stroke();
		*/
	});

	function jump()
	{
		self.jumping = true;
		self.aceleracaoY = -20;
	}

	function stopJumping()
	{
		self.aceleracaoY = 0;
		self.jumping = false;
	}

	function leapFromPlatform()
	{
		if (self.y + self.getHeight() < Menis.root.getHeight())
		{
			self.y += 2;
		}
	}

	function shoryuken()
	{
		jump();
		self.firing = true;
		self.setAnimation(self.animations.shoryuken).flipHorizontally = self.direction === "left";
	}

	function chargeHadouken()
	{
		self.powerCharging = true;
		self.setAnimation(self.animations.powerCharge).flipHorizontally = self.direction === "left";

		self.addEventHandler(Menis.Events.ENTER_FRAME, createPowerParticles);
	}

	function cancelChargeHadouken()
	{
		self.powerCharging = false;

		self.removeEventHandler(Menis.Events.ENTER_FRAME, createPowerParticles);
	}

	function shotHadouken()
	{
		self.powerCharging = false;
		self.firing = true;
		self.setAnimation(self.animations.powerShot).flipHorizontally = self.direction === "left";;

		self.removeEventHandler(Menis.Events.ENTER_FRAME, createPowerParticles);

		for (var i = 0, l = _powerParticles.length; i < l; i++)
			_powerParticles[i].destroy();

		_powerParticles = [];
	}

	function createPowerParticles()
	{
		var maxDist = 100;

		var xPosition = self.direction == "right" ? 32 : 70;

		var destinationPoint = { x: self.x + xPosition, y: self.y + 68 };

		for (var i = 0; i < self.hadoukenPower / 4; i++)
		{
			var p = new Menis.Entity();

			p.divider = 3 + ~~(Math.random() * 7);

			var size = ~~(Math.random() * 3);

			p.setAnimation(new Menis.CodeAnimation(function (g)
			{
				g.fillStyle = "#10AAFF";
				g.fillRect(0, 0, size, size);
			}));

			p.addEventHandler(Menis.Events.ENTER_FRAME, function ()
			{
				var xDist = ((destinationPoint.x - this.x) / this.divider * Math.random());
				var yDist = ((destinationPoint.y - this.y) / this.divider * Math.random());

				if (Math.abs(xDist) < 0.1 && Math.abs(yDist) < 0.1)
				{
					this.destroy();
				}

				this.x += xDist;
				this.y += yDist// * Math.random();
			});

			p.x = destinationPoint.x + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.y = destinationPoint.y + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.compositeOperation = "lighter";

			_powerParticles.push(p);

			Menis.root.addChild(p);
		}
	}

	self.animations = getPlayerAnimations();
});