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

		self.onmousedown(function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_DOWN, e); });
		self.onmouseup(function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_UP, e); });
		self.onmousemove(function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_MOVE, e); });

		self.setSize(SPOT_SIZE, SPOT_SIZE);
	});

	Menis.Observable(Spot);


	var Editor = function () {

		var _selectedTool = null;		
		var _gridContainer = createGridContainer();


		this.setSelectedTool = function (tool) {

			if (_selectedTool) _selectedTool.unload();

			tool.load();
			_selectedTool = tool;
		};

		this.createGrid = function (width, height) {

			for (var i = 0; i < width; i++) {
				for (var j = 0; j < height; j++) {
					
					var spot = new Spot;
					spot.x = i * (spot.getWidth() + 1);
					spot.y = j * (spot.getHeight() + 1);
					
					 _gridContainer.addChild(spot);
				}
			}

			 _gridContainer.setSize(width * SPOT_SIZE, height * SPOT_SIZE);
		};

		function createGridContainer() {

			var gridContainer = new Menis.Entity();
			Menis.root.addChild( gridContainer);

			gridContainer.onmousewheel(function (e) {

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
	Menis(document.getElementsByTagName("canvas")[0]);

	Menis.start();

	var editor = new Editor;
	editor.setSelectedTool(squareSelection);

	editor.createGrid(50, 50);

})();
