import Observable from "./Observable.js";
import Events from "./Events.js";

export default function Mouse(
	container,
	renderer,
	root,
	isDebugMode,
	shouldTraceMouse
)
{
	var self = this;

	Observable(self);

	var _isLeftButtonDown = false;

	self.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	self.x = 0;
	self.y = 0;

	function traceEventPosition(x, y)
	{
		if (!shouldTraceMouse) return;

		var g = renderer.getGraphics();

		g.save();
		
		g.lineWidth = 1;
		g.strokeStyle = "#FF00FF";
		
		g.beginPath();
		g.moveTo(0, y);
		g.lineTo(root.width, y);
		g.stroke();

		g.beginPath();
		g.moveTo(x, 0);
		g.lineTo(x, root.height);
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

		if (isDebugMode()) traceEventPosition(x, y);

		return {x: x, y: y};
	}

	container.addEventListener("mousedown", function (event)
	{
		_isLeftButtonDown = true;
		var pos = eventDefaultAction(this, event);
		self.trigger(Events.MOUSE_DOWN, { x: pos.x, y: pos.y, target: self, originalEvent: event });

	}, true);

	container.addEventListener("mouseup", function (event)
	{
		_isLeftButtonDown = false;
		var pos = eventDefaultAction(this, event);
		self.trigger(Events.MOUSE_UP, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, true);

	container.addEventListener("mousewheel", function (event)
	{
		var pos = eventDefaultAction(this, event);
	    self.trigger(Events.MOUSE_WHEEL, { x: pos.x, y: pos.y, target: self, delta: event.wheelDelta, originalEvent: event });
	}, true);

	container.addEventListener("mousemove", function (event)
	{
		var pos = eventDefaultAction(this, event);
	    self.trigger(Events.MOUSE_MOVE, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, false);
};