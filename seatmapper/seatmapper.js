Menis(document.getElementsByTagName("canvas")[0]);

setTimeout(function () {

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
		self.onmouseenter(function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_OVER, e); });
		self.onmouseleave(function (e) { e.spot = self; Spot.trigger(Menis.Events.MOUSE_OUT, e); });

		self.setSize(SPOT_SIZE, SPOT_SIZE);
	});

	Menis.Observable(Spot);


	var Editor = function () {

		var _selectedTool = null;
		
		var _gridContainer = new Menis.Entity();
		Menis.root.addChild( _gridContainer);

		this.setSelectedTool = function (tool) {

			if (_selectedTool) _selectedTool.unload();

			tool.load();
			_selectedTool = tool;
		};

		this.createGrid = function (width, height) {

			for (var i = 0; i < width; i++) {
				for (var j = 0; j < height; j++) {
					
					var spot = new Spot;
					spot.x = i * spot.getWidth();
					spot.y = j * spot.getHeight();
					
					 _gridContainer.addChild(spot);
				}
			}

			 _gridContainer.setSize(width * SPOT_SIZE, height * SPOT_SIZE);
		};
	};
	/*-----------------------------------------------------------------------------------------------------------*/

	/*Tools -----------------------------------------------------------------------------------------------------*/
	var picker = {

		action: function (e) {
			e.spot.isEmpty = !e.spot.isEmpty;
		},

		load: function () {
			Spot.addEventHandler(Menis.Events.MOUSE_OVER, this.action);
			Spot.addEventHandler(Menis.Events.MOUSE_OUT, this.action);
		},

		unload: function () {
			Spot.removeEventHandler(Menis.Events.MOUSE_OVER, this.action);
			Spot.removeEventHandler(Menis.Events.MOUSE_OUT, this.action);
		}
	};

	var squareSelection = {

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
	/*-----------------------------------------------------------------------------------------------------------*/

	var editor = new Editor;
	editor.setSelectedTool(picker);

	editor.createGrid(50, 50);


	Menis.start();

}, 1000);
