(function (global) {    
Enemy = Menis.Entity.specialize(function ()
{
	var self = this;

	self.x = Menis.root.getWidth() + 10;
	self.y = Math.round(Math.min(Math.random() * Menis.root.getHeight(), Menis.root.getHeight() - 100));
	
	self.setAnimation(
		Menis.Reflection.create(
			Menis.SpritesheetAnimation,
			"img/enemy_flipped.png",
			100,
			100,
			{
				style: Menis.AnimationStyles.YOYO,
				frameDelay: 1
			}
		)
	);
	
	var speed = 1 + Math.round(Math.random() * 7);
	
	self.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (self.hit)
		{
			if (self.x + self.getWidth() > 0)
			{
				var particlesSpacing = 5;

				for (var y = 0; y < self.getHeight(); y += particlesSpacing)
					for (var x = 0; x < self.getWidth(); x += particlesSpacing)
						createParticle(self, x, y);
			}

			self.destroy();

			Menis.root.enemies.splice(Menis.root.enemies.indexOf(self), 1);

			return;
		}

		self.x -= speed;

		if (self.x + self.getWidth() < 0)
		{
			self.hit = true;
			$game.sandBar.current++;
		}
	});
	
	function createParticle(origin, x, y)
	{
		var p = new Menis.Entity();
		
		p.setAnimation(new Menis.CodeAnimation(function(g, e)
		{		
			g.fillStyle = "rgb(174, 151, 79)";
			g.fillRect(0, 0, e.getWidth(), e.getHeight());
		}));
		
		p.x = origin.x + x;
		p.y = origin.y + y;

		p.setWidth(1 + (Math.random() > 0.5 ? 1 : 0));
		p.setHeight(p.getWidth());
		
		p.xaccell 	= Math.random() * (Math.random() < 0.5 ? -1 : 1) * 25;
		p.yaccell 	= -5 - (Math.random() * 15);
		p.ySpeed 	= 1 + Math.random();
		
		p.addEventHandler(Menis.Events.ENTER_FRAME, function ()
		{	
			this.x += Math.round(this.xaccell);
			this.xaccell *= 0.94;

			this.y += Math.round(this.yaccell);
			this.yaccell += this.ySpeed;

			if (this.y > Menis.root.getHeight() || this.x < 0 || this.x > Menis.root.getWidth())
				this.destroy();
		});
		
		Menis.root.addChild(p);
	}
});    
Fireball = Menis.Entity.specialize(function (origin, power)
{
	var self = this;
	var right = origin.direction == "right";
	var speed = 25;

	this.compositeOperation = "lighter";

	power = ~~(power / 20);

	function initialize()
	{
		self.setAnimation(new Menis.SpritesheetAnimation("img/hadouken.png", 42, 40));

		self.getAnimation().flipHorizontally = (origin.direction === "left");
		
		self.explodeAnimation = new Menis.SpritesheetAnimation("img/power_explode.png", 42, 40);
		self.explodeAnimation.flipHorizontally = (origin.direction === "left");
		self.explodeAnimation.actions[2] = function()
		{
			self.destroy();
		};

		self.scale(Math.max(1, power), Math.max(1, power));

		self.x = origin.x + (right ? origin.getWidth() - speed: -self.getWidth() + speed);
		self.y = origin.y + origin.getHeight() / 2 - self.getHeight() / 2;
	}
	
	self.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (self.exploded) return;

		for (var i = 0; i < Menis.root.enemies.length; i++)
		{
			var obs = Menis.root.enemies[i];
			if (self.hitTest(obs))
			{
				obs.hit = true;

				if (--power <= 0)
				{
					self.explode();
					return;
				}
			}
		}

		if (self.x <= 0)
		{
			self.x = 0;
			self.explode();
			return;
		}
		else if (self.x + self.getWidth() >= Menis.root.getWidth())
		{
			self.x = Menis.root.getWidth() - self.getWidth();
			self.explode();
			return;
		}

		self.x += right ? speed : -speed;
	});
	
	initialize();
});

Fireball.prototype.explode = function ()
{
	this.setAnimation(this.explodeAnimation);
	this.frameDelay = 1;
	this.exploded = true;
};    
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
Plataform = Menis.Entity.specialize(function (x, y)
{
	this.setAnimation(new Menis.ImageAnimation("img/plataform.png"));

	this.x = x || 0;
	this.y = y || 0;
});    
ProgressBar = Menis.Entity.specialize(function ()
{
	var text = new Menis.UI.Text("loading...");
	text.fontName = "sans-serif";
	text.fontSize = "25pt";
	text.color = "#FFF"
	text.x = 20;
	text.Y = 20;
	this.addChild(text);

	this.percent = 0;

	var self = this;

	this.setAnimation(new Menis.CodeAnimation(function (g)
	{
		g.fillRect(0, 0, Menis.root.getWidth(), Menis.root.getHeight());

		g.strokeStyle = "#FFFFFF";
		g.rect(Menis.root.getWidth() / 2 - 200, Menis.root.getHeight() / 2 - 10, 400, 20);
		g.stroke();

		g.fillStyle = "#CC0000";

		g.fillRect(
			Menis.root.getWidth() / 2 - 195,
			Menis.root.getHeight() / 2 - 7,
			390 * self.percent / 100,
			14
		);
	}));
});    
SandBar = Menis.Entity.specialize(function ()
{
	this.max = 1000;
	this.current = 0;

	this.setAnimation(new Menis.CodeAnimation(function (g, o)
	{
		var perc = o.current / o.max;

		g.fillStyle = perc < 0.6 ? "rgba(0, 0, 0, 0.7)" : perc < 0.8 ? "rgba(120, 80, 0, 0.7)" : "rgba(255, 0, 0, 0.7)";
		g.fillRect(0, 0, 300, 20);

		g.fillStyle = "rgb(199, 183, 135)";
		g.fillRect(0, 0, Math.floor(300 * perc), 20);

		g.lineWidth = 5;
		g.strokeStyle = perc < 0.6 ? "#000000" : perc < 0.8 ? "#FFAA00" : "#FF0000";
		g.strokeRect(0, 0, 301, 20);
	}));

	this.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (this.current >= this.max && this.onFull)
			this.onFull();
	});
});                         
function Game()
{
	var self = this;

	this.hero = null;
	this.sandBar = null;

	var pb = null;


	this.createGame = function()
	{
		pb = new ProgressBar();
		Menis.root.addChild(pb);

		loadResources();
		
		Menis.start();
	}
	
	this.gameOver = function()
	{
		Menis.root.clearChildren();
		Menis.root.clearHandlers(Menis.Events.ENTER_FRAME);
		
		var gameOverScreen = new Menis.Entity();

		gameOverScreen.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = "#000000";
			g.fillRect(0, 0, Menis.root.getWidth(), Menis.root.getHeight());			
		}));
		
		var text = new Menis.UI.Text("GAME OVER");
		text.fontName = "Segoe Marker";
		text.fontSize = "70px";
		text.color = "#CC0000";
		text.x = 15;
		text.y = 15;
		gameOverScreen.addChild(text);		
		
		Menis.root.addChild(gameOverScreen);
	}

	function createGameAfterLoad()
	{	
		var background = new Menis.Entity("background");
		background.setAnimation(new Menis.ImageAnimation("img/background.png"));
		Menis.root.addChild(background);
		
		Menis.root.enemies          = [];
		Menis.root.enemiesToSestroy = [];
		Menis.root.plataforms       = [];
		
		for(var i = 0; i < 7; i++)
		{
			var p = new Plataform(300, 700 - 100 * i);
			Menis.root.addChild(p);
			Menis.root.plataforms.push(p);
		}	
		
		/**/
		var frameCount = 0;
		var rate = 50;
		var angle = 0;

		Menis.root.addEventHandler(Menis.Events.ENTER_FRAME, function ()
		{
			for (var i = 0; i < this.enemiesToSestroy.length; i++)
			{
				this.enemies.splice(this.enemies.indexOf(this.enemiesToSestroy[i]), 1);
				this.enemiesToSestroy[i].destroy();
			}

			this.enemiesToSestroy = [];

			frameCount = ++frameCount % Math.ceil(rate);

			if (frameCount != 0) return;

			rate -= 0.5;
			rate = Math.max(rate, 20);

			var enemy = new Enemy();
			this.addChild(enemy);
			this.enemies.push(enemy);
		});
		
		self.hero = new Hero();
		self.hero.setId("game_hero");
		Menis.root.addChild(self.hero);
		
		self.sandBar = new SandBar();
		Menis.root.addChild(self.sandBar);
		self.sandBar.x = 15;
		self.sandBar.y = 15;
		self.sandBar.onFull = function ()
		{
			self.gameOver();
		};
	}

	function loadResources()
	{
		var resources =
		[
			"img/background.png",
			"img/plataform.png",			
			"img/enemy_flipped.png",			
			"img/stand.png",
			"img/stand_flipped.png",
			"img/run.png",
			"img/run_flipped.png",
			"img/power.png",
			"img/power_flipped.png",
			"img/shoryuken.png",
			"img/shoryuken_flipped.png",			
			"img/hadouken.png",
			"img/hadouken_flipped.png",
			"img/power_explode.png",
			"img/power_explode_flipped.png"
		];
		
		Menis.resourceManager.loadImages(resources, function ()
		{
			createGameAfterLoad();
			pb.destroy();
		});
	}
	
	if (!window.$game)
		window.$game = this;
}	

//Menis.debugMode = true;
Menis(document.getElementsByTagName('canvas')[0]);
Menis.renderer.setImageSmoothing(false);
window.game = new Game().createGame();                         
})(window);