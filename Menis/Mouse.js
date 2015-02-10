Menis.Mouse = function (container)
{
	var self = this;

	Menis.Observable(self);

	var _isLeftButtonDown = false;

	self.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	self.x = 0;
	self.y = 0;

	function traceEventPosition(x, y)
	{
		if (!Menis.traceMouse) return;

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

		var doc = document.documentElement;

		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		self.x = x;
		self.y = y;

		if (Menis.debugMode) traceEventPosition(x, y);

		return {x: x, y: y};
	}

	container.addEventListener("mousedown", function (event)
	{
		console.log('mouse-down');
		_isLeftButtonDown = true;
		var pos = eventDefaultAction(this, event);
		self.trigger(Menis.Events.MOUSE_DOWN, { x: pos.x, y: pos.y, target: self, originalEvent: event });

	}, true);

	container.addEventListener("mouseup", function (event)
	{
		console.log('mouse-up');
		_isLeftButtonDown = false;
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
		console.log('mouse-move');
		var pos = eventDefaultAction(this, event);
	    self.trigger(Menis.Events.MOUSE_MOVE, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, false);
};