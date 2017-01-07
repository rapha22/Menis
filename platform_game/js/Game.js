Menis.Game = function () {
	var self = this;

	Menis.Observable(self);

	self.objects = [];

	this.hero = null;
	this.sandBar = null;

	this.resources = new Menis.Game.Resources();

	this.layers = {
		background : Menis.root.layer(0),
		scenario   : Menis.root.layer(1),
		characters : Menis.root.layer(2),
		foreground : Menis.root.layer(3),
		chrome     : Menis.root.layer(4)
	};

	var screens = [
		new Menis.Game.Screens.LoadingScreen()
	];

	this.keysBinding = {
		up:    Menis.key.UP,
		down:  Menis.key.DOWN,
		left:  Menis.key.LEFT,
		right: Menis.key.RIGHT,
		jump:   'D',
		attack: 'S'
	};

	var pb = null;


	this.createGame = function() {
		pb = new Menis.Game.ProgressBar();

		this.layers.chrome.addChild(pb);

		this.loadResources();

		Menis.root.addEventHandler(Menis.Events.ENTER_FRAME, function () {
			self.gameLoop();
		});
	}

	this.gameLoop = function gameLoop() {
		if (this.controller)
			this.controller.update();

		Menis.Game.GameLoop.update();
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
		Menis.root.enemiesToDestroy = [];
		Menis.root.platforms        = [];
		
		for(var i = 0; i < 7; i++)
		{
			var p = new Menis.Game.Platform(300, 700 - 100 * i);
			$game.layers.middle.addChild(p);
			Menis.root.platforms.push(p);
		}	
		
		/**/
		var frameCount = 0;
		var rate = 50;
		var angle = 0;

		Menis.root.addEventHandler(Menis.Events.ENTER_FRAME, function ()
		{
			for (var i = 0; i < this.enemiesToDestroy.length; i++)
			{
				this.enemies.splice(this.enemies.indexOf(this.enemiesToDestroy[i]), 1);
				this.enemiesToDestroy[i].remove();
			}

			this.enemiesToDestroy = [];

			frameCount = ++frameCount % Math.ceil(rate);

			if (frameCount != 0) return;

			rate -= 0.5;
			rate = Math.max(rate, 20);

			var enemy = new Menis.Game.Enemy();
			$game.layers.middle.addChild(enemy);
			this.enemies.push(enemy);
		});

		self.hero = new Menis.Game.Hero();
		self.controller = new Menis.Game.Controller(self.hero);
		
		self.sandBar = new Menis.Game.SandBar();
		$game.layers.chrome.addChild(self.sandBar);
		self.sandBar.x = 15;
		self.sandBar.y = 15;
		self.sandBar.onFull = function ()
		{
			self.gameOver();
		};
	}

	this.loadResources = function loadResources() {
		Menis.resourceManager.loadResources(resourcesToBeLoaded, function () {
			self.trigger('resouces-loaded');
		});
	}
	
	Menis.Game.current = this;
};