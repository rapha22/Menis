Menis.Util.ns("Menis.Game.Screens").Level = function Level(fileUrl) {

	var levelData;

	var background;

	this.enemies = [];
	this.platforms = [];
	
	var resources;
	var objects;
	var enemies;
	var startingPoint;
	var endingPoint;

	var layers = {
		background : Menis.root.layer(0),
		scenario   : Menis.root.layer(1),
		characters : Menis.root.layer(2),
		foreground : Menis.root.layer(3),
		chrome     : Menis.root.layer(4)
	};
	
	this.init = function () {
		createBackground();
		createScenario();
		createEnemies();
		positionHero();
	};

	function load() {
		Menis.Ajax(fileUrl, function (json) {
			levelData = JSON.parse(json);
		});
	}

	function createBackground() {
		background = new Menis.Game.Background(levelData.background, layers.background);
	}

	function createScenario() {
		createObjects(levelData.scenario, layers.scenario, platforms);
	}

	function createEnemies() {
		createObjects(levelData.enemies, layers.characters, enemies);
	}

	function positionHero() {
		$game.hero.x = levelData.startingPoint.x;
		$game.hero.y = levelData.startingPoint.y;
	}

	function createObjects(objects, targetLayer, targetList) {
		for (var i = 0, l = objects.length; i < l; i++) {
			var objectData = objecs[i];

			var constructor = eval(objectData.type);
			var o = constructor(objectData);
			targetLayer.addChild(o.ui);
			targetList.push(o);
		}
	}
};