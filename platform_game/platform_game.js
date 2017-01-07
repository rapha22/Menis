(function (global) {
Menis.Game = function ()
{
	var self = this;

	this.hero = null;
	this.sandBar = null;

	this.layers = {
		back       : Menis.root.layer(1),
		middle     : Menis.root.layer(2),
		front      : Menis.root.layer(3),
		background : Menis.root.layer(0),
		chrome     : Menis.root.layer(4)
	};

	var pb = null;


	this.createGame = function()
	{
		pb = new Menis.Game.ProgressBar();

		this.layers.chrome.addChild(pb);

		loadResources();
	}
	
	this.gameOver = function()
	{
		this.layers.chrome.clearChildren();
		Menis.root.clearHandlers(Menis.Events.ENTER_FRAME);
		
		var gameOverScreen = new Menis.Entity();

		gameOverScreen.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = "#000000";
			g.fillRect(0, 0, Menis.root.width, Menis.root.height);			
		}));
		
		var text = new Menis.UI.Text("GAME OVER");
		text.fontName = "Segoe Marker";
		text.fontSize = "70px";
		text.color = "#CC0000";
		text.x = 15;
		text.y = 15;
		gameOverScreen.addChild(text);		
		
		this.layers.chrome.addChild(gameOverScreen);
	}

	function createGameAfterLoad()
	{	
		var background = new Menis.Entity("background");
		background.setAnimation(new Menis.ImageAnimation("img/background.png"));
		$game.layers.background.addChild(background);
		
		Menis.root.enemies          = [];
		Menis.root.enemiesToSestroy = [];
		Menis.root.plataforms       = [];
		
		for(var i = 0; i < 7; i++)
		{
			var p = new Menis.Game.Platform(300, 700 - 100 * i);
			$game.layers.middle.addChild(p);
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

			var enemy = new Menis.Game.Enemy();
			$game.layers.middle.addChild(enemy);
			this.enemies.push(enemy);
		});
		
		self.hero = new Menis.Game.Hero();
		self.hero.id = "game_hero";
		$game.layers.middle.addChild(self.hero);
		
		self.sandBar = new Menis.Game.SandBar();
		$game.layers.chrome.addChild(self.sandBar);
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
		
		Menis.resourceManager.loadResources(resources, function ()
		{
			createGameAfterLoad();
			pb.destroy();
		});
	}
	
	if (!window.$game)
		window.$game = this;
}
Menis.Game.Tile = function (x, y, leftY, rightY)
{
	var size = Menis.Game.Tile.size;

	this.hit = false;

	leftY = leftY || 0;
	rightY = rightY || 0;

	this.x = x;
	this.y = y;
	this.leftY = this.y + leftY;
	this.rightY = this.y + rightY;
	
	//Angle for ramps, hills, etc
	this.angle = Math.atan2(
		(this.y + rightY) - (this.y + leftY),
		(this.x + size) - this.x
	);

	if (Menis.debugMode)
	{
		var square = new Menis.Entity();
		square.setAnimation(new Menis.CodeAnimation(function (g, e)
		{
			g.fillStyle = '#00AA00';
			g.fillRect(x * size, y * size, size, size)
		}));

		Menis.Layers.get(99).addChild(square);
	}
};

Menis.Game.Tile.size = 20;

Menis.Game.Level =
{
	tiles: [],

	map: function (rect)
	{
		var left   = Math.ceil(rect.left / Menis.Game.Tile.size);
		var top    = Math.ceil(rect.top / Menis.Game.Tile.size);
		var right  = Math.ceil(left + (rect.right - rect.left) / Menis.Game.Tile.size);
		var bottom = Math.ceil(top + (rect.bottom - rect.top) / Menis.Game.Tile.size);

		var tiles = this.tiles;

		for (var x = left; x <= right; x++)
		{
			tiles[x] = tiles[x] || [];

			for (var y = top; y <= bottom; y++)
			{
				tiles[x][y] = new Menis.Game.Tile(x, y);
			}
		}
	},

	getTile: function (x, y)
	{
		return this.tiles[x] && this.tiles[x][y] || null;
	},
	
	getClosestTileAtRight: function (startingX, y)
	{
		var tile = null;
		var x = startingX + 1;
		
		for(; !tile && x <= this.tiles.length; x++)
			tile = this.tiles[x] && this.tiles[x][y] || null;
			
		return tile;
	},
	
	getClosestTileAtLeft: function (startingX, y)
	{
		var tile = null;
		var x = startingX - 1;
		
		for(; !tile && x >= -1; x--)
			tile = this.tiles[x] && this.tiles[x][y] || null;
			
		return tile;
	},
	
	getClosestTileAtBottom: function (x, startingY)
	{
		var xTiles = this.tiles[x];

		if (!xTiles) return null;	

		var tile = null;
		var y = startingY + 1;
		
		for(; !tile && y <= xTiles.length; y++)
			tile = xTiles[y];
			
		return tile;
	},
	
	getClosestTileAtTop: function (x, startingY)
	{
		var xTiles = this.tiles[x];

		if (!xTiles) return null;
	
		var tile = null;
		var y = startingY - 1;
		
		for(; !tile && y >= -1; y--)
			tile = xTiles[y];
			
		return tile;
	}
};
var hadouken = function ()
{
	var powerCharging = false;
	var hadoukenPower = 0;

	var _powerParticles = [];

	var chargeAnim = Menis.easy.sprite("img_new/power_charge.png", 36, 47, null, { 1: function () { this.stop(); } });
	var shotAnim = Menis.easy.sprite("img_new/power_fire.png", 36, 47, null,
	{
		1: function (hero)
		{
			$game.layers.front.addChild(new Menis.Game.Fireball(hero, hadoukenPower));
			hadoukenPower = 0;
		},
		2: function (hero) { reset(hero); }
	});

	function charge(hero)
	{
		if (!powerCharging)
		{
			powerCharging = true;
			hero.canChangeAnimation = false;
			hero.canMove = false;
			hero.canJump = false;
			hero.setAnimation(chargeAnim).flipHorizontally = hero.direction === "left";
		}
		
		hadoukenPower = Math.min(100, hadoukenPower + 1);
		createPowerParticles(hero);
	}

	function shot(hero)
	{
		powerCharging = false;
		hero.firing = true;
		hero.setAnimation(shotAnim).flipHorizontally = hero.direction === "left";

		for (var i = 0, l = _powerParticles.length; i < l; i++)
			_powerParticles[i].destroy();

		_powerParticles = [];
	}

	function reset(hero)
	{
		hero.firing = false;
		hero.canMove = true;
		hero.canJump = true;
		hero.canChangeAnimation = true;
	}

	function createPowerParticles(hero)
	{
		var maxDist = 100;

		var xPosition = hero.direction == "right" ? 15 : 30;

		var destinationPoint = { x: hero.x + xPosition, y: hero.y + 45 };

		var maxParticles = hadoukenPower / 4;

		for (var i = 0; i < maxParticles; i++)
		{
			var p = new Menis.Entity();

			p.divider = 3 + ~~(Math.random() * 7);

			var size = ~~(Math.random() * 3);

			p.setAnimation(new Menis.CodeAnimation(function (g)
			{
				g.fillStyle = "#10AAFF";
				g.fillRect(0, 0, size, size);
			}));

			p.enterframe(function ()
			{
				var xDist = ((destinationPoint.x - this.x) / this.divider * Math.random());
				var yDist = ((destinationPoint.y - this.y) / this.divider * Math.random());

				if (Math.abs(xDist) < 0.1 && Math.abs(yDist) < 0.1)
				{
					this.destroy();
				}

				this.x += xDist;
				this.y += yDist;
			});

			p.x = destinationPoint.x + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.y = destinationPoint.y + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.compositeOperation = "lighter";

			_powerParticles.push(p);

			$game.layers.front.addChild(p);
		}
	}


	return { 
		execute: function (hero)
		{
			if (!powerCharging && (hero.jumping || hero.firing)) return false;

			if (Menis.key.isDown('S'))
			{
				charge(hero);
			}
			else if (powerCharging)
			{
				shot(hero);
			}

			return true;
		}
	};
}
var shoryuken = function ()
{
	var isDoing = false;

	var anim = Menis.easy.sprite("img/shoryuken.png", 100, 100, null,
	{
		8: function (hero) { isDoing = false; hero.canChangeAnimation = true; }
	});

	return { 
		execute: function (hero)
		{
			if (!hero.jumping)
			{
				isDoing = false;
				return false;
			}

			if (Menis.key.isDown('S') && !isDoing)
			{
				isDoing = true;
				hero.canChangeAnimation = false;
				hero.jump();
				hero.setAnimation(anim);
			}
			else if (isDoing)
			{
				//Makes shoryuken destroy the enemies
				for (var i = 0; i < Menis.root.enemies.length; i++)
				{
					var en = Menis.root.enemies[i];
					if (hero.hitTest(en))
						en.hit = true;
				}
			}

			return true;
		}
	};
}
Menis.Game.Enemy = Menis.Entity.specialize(function ()
{
	var self = this;

	self.x = Menis.root.width + 10;
	self.y = Math.round(Math.min(Math.random() * Menis.root.height, Menis.root.height - 100));
	
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
			if (self.x + self.width > 0)
			{
				var particlesSpacing = 5;

				for (var y = 0; y < self.height; y += particlesSpacing)
					for (var x = 0; x < self.width; x += particlesSpacing)
						createParticle(self, x, y);
			}

			self.destroy();

			Menis.root.enemies.splice(Menis.root.enemies.indexOf(self), 1);

			return;
		}

		self.x -= speed;

		if (self.x + self.width < 0)
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
			g.fillRect(0, 0, e.width, e.height);
		}));
		
		p.x = origin.x + x;
		p.y = origin.y + y;

		p.width = 1 + (Math.random() > 0.5 ? 1 : 0);
		p.height = p.width;
		
		p.xaccell 	= Math.random() * (Math.random() < 0.5 ? -1 : 1) * 25;
		p.yaccell 	= -5 - (Math.random() * 15);
		p.ySpeed 	= 1 + Math.random();
		
		p.addEventHandler(Menis.Events.ENTER_FRAME, function ()
		{	
			this.x += Math.round(this.xaccell);
			this.xaccell *= 0.94;

			this.y += Math.round(this.yaccell);
			this.yaccell += this.ySpeed;

			if (this.y > Menis.root.height || this.x < 0 || this.x > Menis.root.width)
				this.destroy();
		});

		$game.layers.front.addChild(p);
	}
});
Menis.Game.Fireball = Menis.Entity.specialize(function (origin, power)
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

		self.x = origin.x + (right ? origin.width - speed: -self.width + speed);
		self.y = origin.y + origin.height / 2 - self.height / 2;
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
		else if (self.x + self.width >= Menis.root.width)
		{
			self.x = Menis.root.width - self.width;
			self.explode();
			return;
		}

		self.x += right ? speed : -speed;
	});
	
	initialize();
});

Menis.Game.Fireball.prototype.explode = function ()
{
	this.setAnimation(this.explodeAnimation);
	this.frameDelay = 1;
	this.exploded = true;
};
Menis.Game.Hero = Menis.Entity.specialize(function ()
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
Menis.Game.Platform = Menis.Entity.specialize(function (x, y)
{
	this.setAnimation(new Menis.ImageAnimation("img/plataform.png"));

	this.x = x || 0;
	this.y = y || 0;

	Menis.Game.Level.map({ left: x, top: y, right: x + 200, bottom: y + 10 });
});
Menis.Game.ProgressBar = Menis.Entity.specialize(function ()
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
		g.fillRect(0, 0, Menis.root.width, Menis.root.height);

		g.strokeStyle = "#FFFFFF";
		g.rect(Menis.root.width / 2 - 200, Menis.root.height / 2 - 10, 400, 20);
		g.stroke();

		g.fillStyle = "#CC0000";

		g.fillRect(
			Menis.root.width / 2 - 195,
			Menis.root.height / 2 - 7,
			390 * self.percent / 100,
			14
		);
	}));
});
Menis.Game.SandBar = Menis.Entity.specialize(function ()
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
//Menis.debugMode = true;
Menis(document.getElementsByTagName('canvas')[0]);
Menis.renderer.setImageSmoothing(false);
window.game = new Menis.Game().createGame();

Menis.start();

})(window);
