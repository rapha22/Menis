Hero = Menis.Entity.specialize(function ()
{
	var self = this;

	var _powerParticles = [];

	self.xAccel = 0;
	self.yAccel = 0;
	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;
	self.hadoukenPower = 0;

	var speed = 2;

	function getPlayerAnimations()
	{
		var animations = {};

		animations.stand = Menis.Reflection.create(Menis.SpritesheetAnimation, "img_new/standing.png", 30, 48, { style: Menis.AnimationStyles.YOYO });
		animations.run = Menis.Reflection.create(Menis.SpritesheetAnimation, "img_new/walking.png", 34, 48, { style: Menis.AnimationStyles.YOYO });
		animations.jumping = new Menis.ImageAnimation("img_new/falling.png");


		//Shoryuken
		animations.shoryuken = new Menis.SpritesheetAnimation("img/shoryuken.png", 100, 100);
		animations.shoryuken.actions[5] = function () { self.firing = false; };
		animations.shoryuken.actions[8] = function () { this.stop(); };


		//Power fire
		animations.powerCharge = new Menis.SpritesheetAnimation("img_new/power_charge.png", 36, 47);
		animations.powerCharge.actions[1] = function () { this.stop(); };

		animations.powerShot = new Menis.SpritesheetAnimation("img_new/power_fire.png", 36, 47);
		animations.powerShot.actions[1] = function ()
		{
			Menis.root.addChild(new Fireball(self, self.hadoukenPower));
			self.hadoukenPower = 0;
		};
		animations.powerShot.actions[2] = function () { self.firing = false; };

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
		self.x += self.xAccel;
		self.y += self.yAccel;

		if (self.powerCharging)
			self.hadoukenPower = Math.min(100, self.hadoukenPower + 1);

		if (!self.firing && !self.powerCharging)
		{
			if (Menis.key.isDown(Menis.key.RIGHT)) self.xAccel += speed;
			if (Menis.key.isDown(Menis.key.LEFT)) self.xAccel -= speed;
		}

		var groundY = null;

		//Verifica se o herói está colidindo com o cenário
		if (self.y + self.getHeight() >= Menis.root.getHeight())
		{
			groundY = Menis.root.getHeight();
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
					right:  self.x + self.xAccel + self.getWidth(),
					bottom: self.y + self.yAccel + self.getHeight()
				};

				if (Menis.Collisions.rectanglesOverlapsX(nextMove, p.getRectangle()))
				{
					if (self.y + self.getHeight() <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p.getRectangle()))
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
		else if (self.x + self.getWidth() > Menis.root.getWidth())
		{
			self.x = Menis.root.getWidth() - self.getWidth() - 1;
			self.xAccel *= -1;
		}


		//Controla as animações de corrida e parado
		if (!self.firing && !self.powerCharging)
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

		//Makes shoryuken destroy the enemies
		if (self.jumping && self.firing)
		{
			for (var i = 0; i < Menis.root.enemies.length; i++)
			{
				var obs = Menis.root.enemies[i];
				if (self.hitTest(obs))
					obs.hit = true;
			}
		}

		this.getAnimation().flipHorizontally = self.direction === "left"; //If facing left, flip

		if (groundY !== null) this.y = groundY - this.getHeight();
	});

	function jump()
	{
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

		var xPosition = self.direction == "right" ? 15 : 30;

		var destinationPoint = { x: self.x + xPosition, y: self.y + 45 };

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
	self.scale(1.5, 1.5);
});