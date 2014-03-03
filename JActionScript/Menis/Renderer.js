Menis.Renderer = function (canvas)
{
	var self = this;

	var _mainGraphs = canvas.getContext("2d");

	var _buffer = document.createElement("canvas");
	_buffer.width = canvas.width;
	_buffer.height = canvas.height;

	var _graphs = _buffer.getContext("2d");



	//Animation ---------------------------------------------------------------------------------------
	self.render = function (entities)
	{
		_graphs.clearRect(0, 0, canvas.width, canvas.height);

		drawToBuffer(entities);

		_mainGraphs.clearRect(0, 0, canvas.width, canvas.height);

		self.draw(_buffer, _mainGraphs)
	};

	function drawToBuffer(entities)
	{
		var len = (entities && entities.length) || 0;

		for (var i = 0; i < len; i++)
		{
			_graphs.save();

			var ent = entities[i];

			_graphs.globalAlpha = ent.alpha || 0;

			_graphs.globalCompositeOperation = ent.compositeOperation || "source-over";

			_graphs.translate(ent.x, ent.y);
			_graphs.rotate(ent.rotation * Math.PI / 180);

			ent.animate();

			drawToBuffer(ent.getChildren());

			_graphs.restore();
		}
	}

	self.draw = function (bufferGraphics, mainGraphics)
	{
		mainGraphics.drawImage(bufferGraphics, 0, 0);
	};

	self.getGraphics = function ()
	{
		return _graphs;
	};
};