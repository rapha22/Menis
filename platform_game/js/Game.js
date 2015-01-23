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

Menis(document.getElementsByTagName('canvas')[0]);
window.game = new Game().createGame();