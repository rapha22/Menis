//Initialize game classes
window.main = new Main("script/");
window.main.importFile("teste_script_slope/Globals.js");
window.main.importFile("teste_script_slope/Tile.js");
window.main.importFile("teste_script_slope/Level.js");
window.main.importFile("teste_script_slope/WalkingCharacter.js");
window.main.importFile("teste_script_slope/Tracker.js");
window.main.importFile("teste_script_slope/Levels.js");
window.main.importFile("teste_script_slope/Camera.js");

function Game()
{
	var $this = this;

	this.createGame = function()
	{
		var animator = new Animator(document.getElementById("stage"), 3000, 3000);

		Level.loadLevel(level5);
		
		/**
		var background = new DisplayObject();
		var bgAnimation = new ImageAnimation();
		bgAnimation.frames = ["background.png"];
		background.setAnimation(bgAnimation);		
		$root.addChild(background);
		/**/
		
		window.$tracker = new Tracker("#FF0000", false);
		$root.addChild(window.$tracker);

		window.$tracker2 = new Tracker("#FFFF00", false);
		$root.addChild(window.$tracker2);
		
		var hero = new WalkingCharacter();
		
		$root.addChild(hero);
		
		new Camera(hero);
	
		animator.start();
		
		var counter = 0;
		var test = new DisplayObject();
		test.onEnterFrame = function ()
		{	
			return;
			createSlice();
			createSlice();
			createSlice();
			createSlice();
		};
		
		createSlice();
		
		$root.addChild(test);
	}
	
	this.gameOver = function()
	{

	}

	function createGameAfterLoad()
	{	
	}

	function loadResources()
	{
	}
	
	function createSlice()
	{
		var angle = 45;
	
		var slice = new DisplayObject();
		
		var x = ~~($root.width / 2);
		var y = ~~($root.height / 2);
		
		slice.alpha = 0.5;
		slice.x = x;
		slice.y = y;
		
		slice.setAnimation(new CodeAnimation(function ()
		{
			var radians = (angle = (angle + 1) % 360) * Math.PI / 180;
		
			var sliceX = Math.cos(radians) * slice.x;
			var sliceY = Math.sin(radians) * slice.y;
			
			//$graphs.translate(sliceX, sliceY);
			$graphs.translate(x, y);
			
			$graphs.rotate(radians);
			//$graphs.translate(-sliceX, -sliceY);
		
			$graphs.fillStyle = "#FF0000";
			$graphs.rect(-50, -50, 100, 100);
			$graphs.fill();
		
			/*
			var startX = 0;
			var endX = startX + 100;
			var middleX = (startX + endX) / 2;
			
			var startY = 150;
			var endY = startY - 100	;
			var middleY = endY * 1.1;
		
			$graphs.beginPath();
			$graphs.moveTo(startX, startY);
			$graphs.bezierCurveTo(middleX, middleY, middleX, middleY, endX, startY);
			$graphs.lineTo(middleX, endY);
			$graphs.lineTo(startX, startY);
			$graphs.fillStyle = '#FFFF00';
			$graphs.fill();
			*/
		}));
		
		slice.onEnterFrame = function ()
		{
			$graphs.strokeStyle = "#0000FF";
			$graphs.lineWidth = 1;
		
			$graphs.moveTo(x, 0);
			$graphs.lineTo(x, $root.height);
			$graphs.stroke();
			
			$graphs.moveTo(0, y);
			$graphs.lineTo($root.width, y);
			$graphs.stroke();
			
			//this.destroy();
			
			return;
		
			this.y -= 10;
			this.alpha -= 0.05;
			
			if (this.alpha <= 0) this.destroy();
		};
		
		$root.addChild(slice);	
	}
	
	if (!window.$game)
		window.$game = this;
}