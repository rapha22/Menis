Menis.Util.ns("Menis.Game.Util", function (ns) {
	
	var id = 1;
	ns.getNewId = function getNewId() {
		return id++;
	};

	ns.linkPosition = function (obj, ui) {
		Object.defineProperty(ui, 'x',  {
			get: function () { return obj.x; },
			set: function (value) { obj.x = value; }
		});

		Object.defineProperty(ui, 'y',  {
			get: function () { return obj.y; },
			set: function (value) { obj.y = value; }
		});
	};
});