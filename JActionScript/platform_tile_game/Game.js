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
	
	if (!window.$game)
		window.$game = this;
}