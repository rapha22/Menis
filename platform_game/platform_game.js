import Menis from '../Menis/Menis.js'
function Game() {
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

	this.objects = new GameObjectsManager();

	this.platforms = [];

	var pb = null;


	this.createGame = function() {
		Menis.root.enterframe(function () {
			self.objects.processFrame();
		});

		pb = new ProgressBar();

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
		
		for(var i = 0; i < 7; i++)
		{
			var p = new Platform(300, 700 - 100 * i);
			$game.layers.middle.addChild(p);
		}	

		self.hero = new Hero();
		$game.layers.middle.addChild(self.hero.graphs);
		
		self.sandBar = new SandBar();
		$game.layers.chrome.addChild(self.sandBar);
		self.sandBar.x = 15;
		self.sandBar.y = 15;
		self.sandBar.onFull = function ()
		{
			self.gameOver();
		};
		
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
			$game.layers.middle.addChild(enemy);
			this.enemies.push(enemy);
		});
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
			"img/power_explode_flipped.png",
			"img_new/shoryuken.png",
			"img_new/hit.png"
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
var GameObject = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,

	getRectangle: function () {
		return {
			left: this.x,
			top: this.y,
			right: this.x + this.width,
			bottom: this.y + this.height
		};
	},

	hitTest: function (other) {
		return Menis.Collisions.rectanglesOverlaps(
			this.getRectangle(),
			other.getRectangle()
		);
	},

	destroy: function () {
		if (this.graph) this.graph.destroy();
		game.objects.remove(this);
	},

	processFrame() {}
};
var GameObjectsManager = function () {
	var objects = Object.create(null);
	var lastId = 1;

	this.processFrame = function () {
		for (var id in objects)
			objects[id].processFrame();
	};

	this.add = function (o) {
		o._id = "obj_" + lastId++;
		objects[o._id] = o;
	};

	this.remove = function (o) {
		delete objects[o._id];
	};
};
var Tile = function (x, y, leftY, rightY)
{
	var size = Tile.size;

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

Tile.size = 20;

var Level =
{
	tiles: [],

	map: function (rect)
	{
		var left   = Math.ceil(rect.left / Tile.size);
		var top    = Math.ceil(rect.top / Tile.size);
		var right  = Math.ceil(left + (rect.right - rect.left) / Tile.size);
		var bottom = Math.ceil(top + (rect.bottom - rect.top) / Tile.size);

		var tiles = this.tiles;

		for (var x = left; x <= right; x++)
		{
			tiles[x] = tiles[x] || [];

			for (var y = top; y <= bottom; y++)
			{
				tiles[x][y] = new Tile(x, y);
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
var HadoukenState = function (hero) {
	var active = false;
	var powerCharging = false;
	var firing = false;
	var power = 0;
	var powerParticles = [];

	var animations = {
		charging: Menis.sprite("img_new/power_charge.png", 36, 47, null, { 1: function () { this.stop(); } }),
		firing: Menis.sprite("img_new/power_fire.png", 36, 47, null, {
			1: function () { Fireball(hero, power); },
			3: function () { reset(); }
		})
	};

	this.shouldApply = function () {
		if (active) return true;
		if (hero.jumping) return false;
		if (Menis.key.isDown('S')) return true;
		return false;
	};

	this.processBeforeCollision = function () {
		active = true;
		if (Menis.key.isDown('S') && !firing) {
			charge(hero);
		}
		else {
			fire(hero);
		}
	};

	this.setAnimation = function () {
		hero.setAnimation(powerCharging ? animations.charging : animations.firing, true);
	};

	this.getFriction = function () {
		return 3;
	};

	function charge(hero) {
		powerCharging = true;
		power = Math.min(10, power += 0.05);
		createPowerParticles(hero);
	}

	function fire(hero) {
		powerCharging = false;
		firing = true;

		for (var i = 0, l = powerParticles.length; i < l; i++)
			powerParticles[i].destroy();

		powerParticles = [];
	}

	function reset(hero) {
		active = false;
		powerCharging = false;
		firing = false;
		power = 0;
	}

	function createPowerParticles(hero) {
		var maxDist = 100;

		var xPosition = hero.direction == "right" ? 15 : 30;

		var destinationPoint = { x: hero.x + xPosition, y: hero.y + 45 };

		var maxParticles = (power * 25) / 4;

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

			powerParticles.push(p);

			$game.layers.front.addChild(p);
		}
	}
};
var ShoryukenState = function (hero) {
	var active = false;
	var hasRaised = false;
	var hasExecuted = false;

	var anim = Menis.sprite("img_new/shoryuken.png", 42, 60, null, {
		4: end
	});

	this.shouldApply = function () {
		if (!hero.jumping) hasExecuted = false;

		if (active) return true;
		if (hasExecuted) return false;
		if (hero.jumping && Menis.key.isDown('S')) return true;
		
		return false;
	};

	this.processBeforeCollision = function () {
		active = true;

		if (!hasRaised) {
			hero.yAccel = -20;
			hasRaised = true;
		}
		
		for (var i = 0; i < Menis.root.enemies.length; i++) {
			var en = Menis.root.enemies[i];
			if (hero.hitTest(en)) en.hit = true;
		}

		createFireParticles();
	};

	this.setAnimation = function () {
		hero.setAnimation(anim, true).frameDelay = 1;
	};

	this.getFriction = function () {
		return 3;
	};

	function end() {
		active = false;
		hasExecuted = true;
		hasRaised = false;
	}

	function createFireParticles() {
		for (var i = 0; i < 100; i++) {
			(function (i) {
				var p = new Menis.Entity();
				p.setAnimation(new Menis.CodeAnimation(function (g) {
					g.fillStyle = '#F80';
					g.fillRect(0, 0, i % 4, i % 4);
				}));
				p.enterframe(function () {
					this.y -= i % 3;
					this.alpha -= 0.1 - (i % 5) / 100;
					if (this.alpha <= 0) this.destroy();
				});

				p.x = (hero.x - 20) + ~~(Math.random() * (hero.width + 40));
				p.y = (hero.y - 20) + ~~(Math.random() * (hero.height + 40));
				p.compositeOperation = "lighter";

				Menis.root.addChild(p);
			})(i);
		}
	}
};
var BaseHeroState = function (hero) {
	var speed = 2;

	var animations = {
		stand   : Menis.sprite("img_new/standing.png", 30, 48, { style: Menis.AnimationStyles.YOYO }),
		run     : Menis.sprite("img_new/walking.png", 34, 48, { style: Menis.AnimationStyles.YOYO }),
		jumping : Menis.image("img_new/falling.png")
	};

	this.shouldApply = function () {
		return false;
	}

	this.processBeforeCollision = function () {
		if (Menis.key.isDown(Menis.key.RIGHT)) hero.xAccel += speed;
		if (Menis.key.isDown(Menis.key.LEFT)) hero.xAccel -= speed;

		if (Menis.key.isDown(Menis.key.DOWN, "D") && !hero.jumping) {
			leapFromPlatform();
		}
		else if (Menis.key.isDown("D") && !hero.jumping) {
			jump();
		}
	};

	this.setAnimation = function () {
		if (hero.jumping) {
			hero.setAnimation(animations.jumping, true);
		}
		else {
			if (hero.xAccel != 0) {
				hero.setAnimation(animations.run, true);
				var delayer = Math.abs(hero.xAccel);
				hero.getAnimation().frameDelay = (delayer === 0) ? 5 : Math.floor(speed / Math.max(delayer / 5, 1));
			}
			else {
				hero.setAnimation(animations.stand, true).frameDelay = 4;
			}
		}
	};

	this.getFriction = function () {
		return 1;
	}

	function jump(result) {
		if (!hero.canJump) return;
		hero.yAccel = -20;
	}

	function leapFromPlatform() {
		hero.y += 2;
	}
};
var Enemy = Menis.Entity.specialize(function ()
{
	var self = this;

	self.x = Menis.root.width + 10;
	self.y = Math.round(Math.min(Math.random() * Menis.root.height, Menis.root.height - 100));
	
	self.setAnimation(Menis.sprite(
		"img/enemy_flipped.png",
		100,
		100,
		{ style: Menis.AnimationStyles.YOYO, frameDelay: 1 }
	));
	
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
var enforceScenarioBoundaries = function (target) {
	var groundY = null;

	if (target.y + target.height >= Menis.root.height) {
		groundY = Menis.root.height;
		stopJumping();
	}
	else
	{
		//Verifica se está colidindo com alguma plataforma
		for (var i = 0; i < game.platforms.length; i++) {
			var p = game.platforms[i];

			var nextMove = {
				left:   target.x + target.xAccel,
				top:    target.y + target.yAccel,
				right:  target.x + target.xAccel + target.width,
				bottom: target.y + target.yAccel + target.height
			};

			if (Menis.Collisions.rectanglesOverlapsX(nextMove, p.getRectangle())) {
				if (target.y + target.height <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p.getRectangle())) {
					groundY = p.y;
					stopJumping();
					break;
				}
			}
		}

		if (groundY === null) //If we don't have a plataform to stand, then we are jumping/falling
			target.jumping = true;
	}

	if (target.x < 0) {
		target.x = 0;
		target.xAccel = 0;
	}
	else if (target.x + target.width > Menis.root.width) {
		target.x = Menis.root.width - target.width - 1;
		target.xAccel = 0;
	}

	if (groundY !== null) target.y = groundY - target.height;

	
	function stopJumping() {
		target.yAccel = 0;
		target.jumping = false;
	}
};
var FireballProto = function () {
	var self = Object.create(GameObject);
	
	var speed = 25;

	self.baseWidth = 42;
	self.baseHeight = 40;
	
	self.processFrame = function () {
		if (this.exploded) return;

		for (var i = 0; i < Menis.root.enemies.length; i++) {
			var enemy = Menis.root.enemies[i];
			if (this.hitTest(enemy)) {
				enemy.hit = true;
				this.createHit(enemy);
				if (--this.power <= 0) {
					this.explode();
					return;
				}
			}
		}

		if (this.x <= 0)
		{
			this.x = 0;
			this.explode();
			return;
		}
		else if (this.x + this.width >= Menis.root.width)
		{
			this.x = Menis.root.width - this.width;
			this.explode();
			return;
		}

		this.x += this.right ? speed : -speed;
		this.setupSize();

		this.syncAnimation();
	};

	self.setupSize = function () {
		this.width = ~~(this.baseWidth * Math.max(1, this.power / 1.5));
		this.height = ~~(this.baseHeight * Math.max(1, this.power / 1.5));
		this.y = this.pathY - (this.height / 2);
	};

	self.explode = function () {
		this.exploded = true;
		this.graph.setAnimation(this.explodeAnimation, true).frameDelay = 1;
	};

	self.syncAnimation = function () {
		this.graph.x = this.x;
		this.graph.y = this.y;
		var scale = Math.max(1, this.power / 1.5);
		this.graph.scale(scale, scale);
		this.graph.getAnimation().flipHorizontally = !this.right;
	};

	self.createHit = function (enemy) {
		var hit = new Menis.Entity();
		hit.scale(3.5, 3.5);
		hit.compositeOperation = "lighter";
		hit.setAnimation(Menis.sprite('img_new/hit.png', 27, 25, null, { 4: function () { hit.destroy(); } }));
		var rect = Menis.Collisions.getOverlappingRectangle(this.getRectangle(), enemy.getRectangle());
		hit.x = rect.left + ((rect.right - rect.left) / 2) - hit.width / 2;
		hit.y = rect.top + ((rect.bottom - rect.top) / 2) - hit.height / 2;
		game.layers.front.addChild(hit);
	};

	return self;
}();

var Fireball = function (origin, power) {
	var self = Object.create(FireballProto);
	
	game.objects.add(self);
	
	self.right = origin.direction == "right";
	self.power = ~~power + 1;
	self.pathY = origin.y + origin.height / 2;
	self.x = self.right ? origin.x + origin.width : origin.x;
	
	self.setupSize();

	self.graph = new Menis.Entity();
	self.graph.compositeOperation = "lighter";
	
	self.graph.setAnimation(Menis.sprite("img/hadouken.png", 42, 40));

	self.explodeAnimation = Menis.sprite("img/power_explode.png", 42, 40,
		{ flipHorizontally: !self.right },
		{ 2: function () { self.destroy(); } }
	);

	self.syncAnimation();

	game.layers.front.addChild(self.graph);

	return self;
};
var Hero = function () {
	var self = Object.create(GameObject);

	game.objects.add(self);

	self.baseState = new BaseHeroState(self);
	self.states = [
		self.baseState,
		new HadoukenState(self),
		new ShoryukenState(self)
	];

	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;
	self.canMove = true;
	self.canJump = true;
	self.canChangeAnimation = true;
	self.friction = 0;

	self.x = 0;
	self.y = 0;
	self.width = 45;
	self.height = 72;
	self.xAccel = 0;
	self.yAccel = 0;

	self.state = new BaseHeroState(self);

	self.graphs = new Menis.Entity('hero');

	self.processFrame = function ()
	{
		self.state = getCurrentState();

		self.state.processBeforeCollision();

		self.x += self.xAccel;
		self.y += self.yAccel;

		enforceScenarioBoundaries(self);

		applyGravity();

		setDiretion();

		applyFriction(self.state.getFriction());

		self.state.setAnimation();
		self.graphs.getAnimation().flipHorizontally = self.direction === "left"; //If facing left, flip

		self.graphs.x = self.x;
		self.graphs.y = self.y;
	};

	function getCurrentState() {
		for (var i = 0, l = self.states.length; i < l; i++) {
			if (self.states[i].shouldApply())
				return self.states[i];
		}

		return self.baseState;
	}

	function applyGravity() {
		if (self.jumping) {			
			self.yAccel += 2; //Gravity

			if (Math.abs(self.yAccel) > 100)
				self.yAccel = self.yAccel < 0 ? -100 : 100;
		}
	}

	function applyFriction(friction) {
		if (self.jumping) friction = 1;
		if (self.xAccel > 0) self.xAccel = Math.max(self.xAccel - friction, 0);
		else if (self.xAccel < 0) self.xAccel = Math.min(self.xAccel + friction, 0);
	}

	function setDiretion() {
		if (self.xAccel > 0) self.direction = "right";
		else if (self.xAccel < 0) self.direction = "left";
	}

	self.getAnimation = self.graphs.getAnimation.bind(self.graphs);
	self.setAnimation = self.graphs.setAnimation.bind(self.graphs);

	function stopJumping()
	{
		self.yAccel = 0;
		self.jumping = false;
	}

	self.graphs.scale(1.5, 1.5);

	return self;
};
var Platform = Menis.Entity.specialize(function (x, y)
{
	this.setAnimation(new Menis.ImageAnimation("img/plataform.png"));

	this.x = x || 0;
	this.y = y || 0;

	Level.map({ left: x, top: y, right: x + 200, bottom: y + 10 });

	game.platforms.push(this);
});
var ProgressBar = Menis.Entity.specialize(function ()
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
var SandBar = Menis.Entity.specialize(function ()
{
	this.max = 100;
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
window.game = new Game();
game.createGame();

Menis.start();
