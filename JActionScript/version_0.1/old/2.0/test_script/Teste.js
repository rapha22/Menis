window.main = new Main("script/");
window.main.importFile("test_script/Hero.js");
window.main.importFile("test_script/Fireball.js");
window.main.importFile("test_script/Obstacle.js");

function createGame()
{

	var background = new DisplayObject("background");
	var bgAnimation = new CodeAnimation();
	bgAnimation.drawingFunctions.push(function(o)
	{
		//window.$graphs.fillStyle = "rgba(0, 0, 0, 0.7)";
		window.$graphs.fillRect(0, 0, window.$root.width, window.$root.height);
	});
	background.setAnimation(bgAnimation);



	var animator = new Animator(document.getElementById("stage"));
	animator.addChild(background);
	animator.addChild(new Hero());
	animator.start();
	
	$root.obstacles = [];
	
	/**/
	var frameCount = 0;
	animator.onEnterFrame = function()
	{
		frameCount = ++frameCount % 40;
	
		if (frameCount != 0) return;
		
		frameCount = 0;
	
		var obstacle = new Obstacle();		
		$root.addChild(obstacle);
		$root.obstacles.push(obstacle);
	}
	/**
	var obstacle = new Obstacle();		
	$root.addChild(obstacle);
	$root.obstacles.push(obstacle);
	/**/
}