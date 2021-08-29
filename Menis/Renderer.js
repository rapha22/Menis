export default function Renderer(canvas, isDebugMode) {
	var self = this;

	var _mainGraphs = canvas.getContext("2d");

	var _buffer = document.createElement("canvas");
	_buffer.width = canvas.width;
	_buffer.height = canvas.height;

	var _graphs = _buffer.getContext("2d");

	if (isDebugMode()) _graphs = _mainGraphs;


	//Animation ---------------------------------------------------------------------------------------
	self.render = function (entities)
	{
		_graphs.clearRect(0, 0, canvas.width, canvas.height);

		drawToBuffer(entities);

		if (isDebugMode()) return;

		window.requestAnimationFrame(function ()
		{
			_mainGraphs.clearRect(0, 0, canvas.width, canvas.height);

			self.draw(_buffer, _mainGraphs);
		});
	};

	function drawToBuffer(entities)
	{
		var len = (entities && entities.length) || 0;

		for (var i = 0; i < len; i++)
		{
			_graphs.save();

			var ent = entities[i];

			applyTransformations(ent);

			if (isDebugMode())
			{
				_graphs.strokeStyle = "#FFFF00";
				_graphs.strokeRect(0, 0, ent._width, ent._height);
				_graphs.font = '10px sans-serif';
				_graphs.strokeText(ent._id, 5, 5);
			}

			ent.animate(self);

			drawToBuffer(ent.getChildren());

			_graphs.restore();
		}
	}

	function applyTransformations(ent)
	{
		//_graphs.setTransform(1, ent.skewX, ent.skewY, 1, 0, 0); //No skew support yet

		_graphs.globalAlpha = ent.alpha || 0;

		_graphs.globalCompositeOperation = ent.compositeOperation || "source-over";

		_graphs.translate(ent.x, ent.y);

		_graphs.scale(ent._scaleX, ent._scaleY);

		if (ent.rotation)
		{
			if (ent.rotationAnchor)
				_graphs.translate(ent.rotationAnchor.x, ent.rotationAnchor.y);

			_graphs.rotate(ent.rotation * Math.PI / 180);

			if (ent.rotationAnchor)
				_graphs.translate(ent.rotationAnchor.x * -1, ent.rotationAnchor.y * -1);
		}

		if (ent._clippingRect)
		{
			var c = ent._clippingRect;

			_graphs.beginPath();
			_graphs.rect(ent.x + c.x, ent.y + c.y, c.width, c.height);
			_graphs.clip();
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

	self.setImageSmoothing = function (value)
	{
		_graphs.imageSmoothingEnabled = value;
	};
};