Menis.Mouse = function (container)
{
	var self = this;

	Menis.Observable(self);

	var _isLeftButtonDown = false;

	self.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	function traceEventPosition(x, y)
	{
		var g = Menis.renderer.getGraphics();

		g.save();
		
		g.lineWidth = 1;
		g.strokeStyle = "#FF00FF";
		
		g.beginPath();
		g.moveTo(0, y);
		g.lineTo(Menis.root.getWidth(), y);
		g.stroke();

		g.beginPath();
		g.moveTo(x, 0);
		g.lineTo(x, Menis.root.getHeight());
		g.stroke();

		g.restore();
	}

	function eventDefaultAction(target, event)
	{
		event.preventDefault();

		var rect = target.getClientRects()[0];

		var borderWidth = target.style.borderWidth

		var x = event.pageX - rect.left;
		var y = event.pageY - rect.top;

		if (Menis.debugMode) traceEventPosition(x, y);

		return {x: x, y: y};
	}

	container.addEventListener("mousedown", function (event)
	{
		var pos = eventDefaultAction(this, event);
		self.trigger(Menis.Events.MOUSE_DOWN, { x: pos.x, y: pos.y, target: self, originalEvent: event });

	}, true);

	container.addEventListener("mouseup", function (event)
	{
		var pos = eventDefaultAction(this, event);
		self.trigger(Menis.Events.MOUSE_UP, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, true);

	container.addEventListener("mousewheel", function (event)
	{
		var pos = eventDefaultAction(this, event);
	    self.trigger(Menis.Events.MOUSE_WHEEL, { x: pos.x, y: pos.y, target: self, delta: event.wheelDelta, originalEvent: event });
	}, true);

	container.addEventListener("mousemove", function (event)
	{
		var pos = eventDefaultAction(this, event);
	    self.trigger(Menis.Events.MOUSE_MOVE, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, false);
};