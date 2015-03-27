(function () {

	/*Classes ---------------------------------------------------------------------------------------------------*/
	var SPOT_SIZE = 25;

	var Spot = Menis.Entity.specialize(function () {

		this.isEmpty = true;

		var self = this;

		self.setAnimation(new Menis.CodeAnimation(function (g, ent) {

			g.strokeStyle = '#C0C0C0';
			g.strokeRect(0, 0, SPOT_SIZE, SPOT_SIZE);

			if (!self.isEmpty) {
				g.fillStyle = 'red';
				g.fillRect(0, 0, SPOT_SIZE, SPOT_SIZE);
			}
		}));

		self.on(Menis.Events.MOUSE_DOWN, function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_DOWN, e); });
		self.on(Menis.Events.MOUSE_UP,   function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_UP, e); });
		self.on(Menis.Events.MOUSE_MOVE, function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_MOVE, e); });

		self.setSize(SPOT_SIZE, SPOT_SIZE);
	});

	Menis.Observable(Spot);


	var Editor = function () {

		var _selectedTool = null;
		var _scrollPanel = new Menis.UI.ScrollPanel(0, 0, Menis.root.width - 20, Menis.root.height - 20);
		var _gridContainer = createGridContainer();

		_scrollPanel.addChild(_gridContainer);
		Menis.root.addChild(_scrollPanel);


		this.setSelectedTool = function (tool) {

			if (_selectedTool) _selectedTool.unload();

			tool.load();
			_selectedTool = tool;
		};

		this.createGrid = function (width, height) {

			for (var i = 0; i < width; i++) {
				for (var j = 0; j < height; j++) {
					
					var spot = new Spot;
					spot.x = i * (spot.width + 1);
					spot.y = j * (spot.height + 1);
					
					 _gridContainer.addChild(spot);
				}
			}

			 _gridContainer.setSize(width * SPOT_SIZE, height * SPOT_SIZE);
		};

		function createGridContainer() {

			var gridContainer = new Menis.Entity();

			gridContainer.on(Menis.Events.MOUSE_WHEEL, function (e) {

				var scale = this.scale();
				if (e.delta > 0) this.scale(scale.x + 0.1, scale.y + 0.1);
				else this.scale(scale.x - 0.1, scale.y - 0.1);
			});

			return gridContainer;
		}
	};
	/*-----------------------------------------------------------------------------------------------------------*/

	/*Tools -----------------------------------------------------------------------------------------------------*/
	var picker = {

		action: function (e) {
			e.spot.isEmpty = !e.spot.isEmpty;
		},

		load: function () {
			Spot.addEventHandler(Menis.Events.MOUSE_UP, this.action);
		},

		unload: function () {
			Spot.removeEventHandler(Menis.Events.MOUSE_UP, this.action);
		}
	};

	var squareSelection = {

		action: function (e) {
			if (Menis.mouse.isDown())
				e.spot.isEmpty = !e.spot.isEmpty;
		},

		load: function () {
			Spot.addEventHandler(Menis.Events.MOUSE_MOVE, this.action);
		},

		unload: function () {
			Spot.removeEventHandler(Menis.Events.MOUSE_MOVE, this.action);
		}
	};
	/*-----------------------------------------------------------------------------------------------------------*/

	//Menis.debugMode = true;
	//Menis.traceMouse = true;
	Menis(document.getElementsByTagName("canvas")[0]);

	Menis.start();

	var editor = new Editor;
	editor.setSelectedTool(picker);

	editor.createGrid(50, 50);
})();
