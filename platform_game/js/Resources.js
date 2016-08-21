Menis.Game.Resources = function Resources() {
	var self = this;

	var resourcesToLoad = [];
	var counter = 0;

	Menis.Observable(this);

	this.add = function add(/*urls*/) {
		[].concat.apply(resourcesToLoad, arguments);
	};

	this.load = function load() {
		Menis.resourceManager.on(Menis.Events.RESOURCE_LOADED, resourceLoaded);
		Menis.resourceManager.loadResources(resourcesToLoad, loadingFinished);
	};

	function loadingFinished() {
		Menis.resourceManager.off(Menis.Events.RESOURCE_LOADED, resourceLoaded);
		self.trigger('loading-finished');
		resourcesToLoad = [];
	}

	function resourceLoaded() {
		self.trigger('loading-progress', ++counter / resourcesToLoad.length * 100);
	}
};