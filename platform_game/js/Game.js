import Menis from '../../Menis/Menis.js';
import GameObjectsManager from './GameObjectsManager.js';
import Hero from './Hero.js';
import ProgressBar from './ProgressBar.js';
import Platform from './Platform.js';
import SandBar from './SandBar.js';
import Enemy from './Enemy.js';

export default function Game() {
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