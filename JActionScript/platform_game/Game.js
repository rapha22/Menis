//Initialize game classes
JSLoader.loadScripts(["Menis/Menis.js"], function ()
{
	Menis(document.getElementsByTagName("canvas")[0]);

	JSLoader.loadScripts(
		[
			"platform_game/Hero.js",
			"platform_game/Fireball.js",
			"platform_game/Enemy.js",
			"platform_game/Plataform.js",
			"platform_game/ProgressBar.js",
			"platform_game/SandBar.js"
		],
		function () { window.game = new Game().createGame(); }
	);
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

		gameOverScreen.animation = new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = "#000000";
			g.fillRect(0, 0, Menis.root.width, Menis.root.height);			
		});
		
		var text = new Menis.Text("Game Over");
		text.fontName = "Courier New";
		text.fontSize = "70px";
		text.color = "#FFFFFF";
		text.x = 15;
		text.y = 15;
		gameOverScreen.addChild(text);		
		
		Menis.root.addChild(gameOverScreen);
	}

	function createGameAfterLoad()
	{	
		var background = new Menis.Entity("background");
		background.animation = new Menis.ImageAnimation("platform_game/img/background.png");
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
			"platform_game/img/background.png",
			"platform_game/img/plataform.png",
			
			"platform_game/img/enemy_flipped.png",
			
			"platform_game/img/stand.png",
			"platform_game/img/stand_flipped.png",
			"platform_game/img/run.png",
			"platform_game/img/run_flipped.png",
			"platform_game/img/power.png",
			"platform_game/img/power_flipped.png",
			"platform_game/img/shoryuken.png",
			"platform_game/img/shoryuken_flipped.png",
			
			"platform_game/img/hadouken.png",
			"platform_game/img/hadouken_flipped.png",
			"platform_game/img/power_explode.png",
			"platform_game/img/power_explode_flipped.png"
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