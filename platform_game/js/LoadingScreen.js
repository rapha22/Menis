Menis.Util.ns("Menis.Game").LoadingScreen = function LoadingScreen(resources, next) {

	var pb;
	var background;

	var self = this;

	this.init = function () {

		$game.level = null;

		listenResourcesLoading();
		createProgressBar();
		createBackground();

		Menis.Game.Resources.load();
	};

	this.remove = function () {
		pb.remove();
		background.remove();
	};

	function listenResourcesLoading() {
		Menis.resourceManager.on(Menis.Events.RESOURCE_LOADED, onResourceLoaded);
		Menis.resourceManager.loadResources(resourcesToLoad, onLoadingFinished);
	}

	function unlistenResourcesLoading() {
		Menis.resourceManager.off(Menis.Events.RESOURCE_LOADED, onResourceLoaded);
	}

	function createProgressBar() {
		pb = new Menis.Game.ProgressBar();
		$game.layers.chrome.addChild(background);
	}

	function createBackground() {
		background = new Menis.Entity();
		background.setAnimation(new Menis.CodeAnimation(function (g) {
			g.fillStyle = '#000';
			g.fillRect(0, 0, Menis.root.width, Menis.root.height);
		}));
		$game.layers.background.addChild(background);
	}

	function onResourceLoaded(perc) {
		pb.percent = perc;
	}

	function onLoadingFinished() {
		unlistenResourcesLoading();
		$game.setScene(next);
	}
};