Menis.Mouse = function (canvas)
{
	var _isLeftButtonDown = false;

	this.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	canvas.addEventListener("mousedown", function (event)
	{
		_isLeftButtonDown = true;

		Menis.root.trigger(Menis.Events.MOUSE_DOWN, { x:event.x, y:event.y });
	});

	canvas.addEventListener("mouseup", function (event)
	{
		_isLeftButtonDown = false;
		Menis.root.trigger(Menis.Events.MOUSE_UP, { x: event.x, y: event.y });
	});
};