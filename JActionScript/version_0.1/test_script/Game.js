//Initialize game classes
window.main = new Main("script/");
window.main.importFile("test_script/Hero.js");
window.main.importFile("test_script/Fireball.js");
window.main.importFile("test_script/Enemy.js");
window.main.importFile("test_script/Plataform.js");
window.main.importFile("test_script/ProgressBar.js");
window.main.importFile("test_script/SandBar.js");

function Game()
{
	var $this = this;

	this.hero = null;
	this.sandBar = null;


	this.createGame = function()
	{
		var animator = new Animator(document.getElementById("stage"));

		var pb = new ProgressBar();
		$root.addChild(pb);

		$resourceManager.onLoadAll = function()
		{
			createGameAfterLoad();
			pb.destroy();
		};
		
		loadResources();
		
		animator.start();
	}
	
	this.gameOver = function()
	{
		$root.clearChildren();
		$root.onEnterFrame = null;
		
		var gameOverScreen = new DisplayObject();
		var anim = new CodeAnimation();
		anim.drawingFunctions.push(function(o)
		{
			$graphs.fillStyle = "#000000";
			$graphs.fillRect(0, 0, $root.width, $root.height);			
		});
		gameOverScreen.setAnimation(anim);
		
		var text = new Text("Game Over");
		text.fontName = "Courier New";
		text.fontSize = "70px";
		text.color = "#FFFFFF";
		text.x = 15;
		text.y = 15;
		gameOverScreen.addChild(text);		
		
		$root.addChild(gameOverScreen);
	}

	function createGameAfterLoad()
	{	
		var background = new DisplayObject("background");
		var bgAnimation = new ImageAnimation();
		bgAnimation.frames = ["img/background.png"];
		background.setAnimation(bgAnimation);	
		$root.addChild(background);
		
		
		$root.enemies = [];
		$root.enemiesToSestroy = [];
		$root.plataforms = [];
		
		for(var i = 0; i < 7; i++)
		{
			var p = new Plataform(300, 700 - 100 * i);
			$root.addChild(p);
			$root.plataforms.push(p);
		}	
		
		/**/
		var frameCount = 0;
		var rate = 50;
		var angle = 0;
		$root.onEnterFrame = function()
		{
			for(var i = 0; i < this.enemiesToSestroy.length; i++)
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
		}
		
		$this.hero = new Hero();
		$root.addChild($this.hero);
		
		$this.sandBar = new SandBar();
		$root.addChild($this.sandBar);
		$this.sandBar.x = 10;
		$this.sandBar.y = 10;
		$this.sandBar.onFull = function()
		{
			$this.gameOver();
		}
		
		var test = new DisplayObject();
		test.setAnimation(new CodeAnimation(function(o)
		{
			$graphs.beginPath();
			$graphs.fillStyle = "#FF0000";
			$graphs.arc(200, 200, 50, 0, (angle = (angle + 1) % 361) * Math.PI / 180);
			$graphs.fill();
		}));
		$root.addChild(test);
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
		
		window.$resourceManager.loadResources(resources);
	}
	
	if (!window.$game)
		window.$game = this;
}