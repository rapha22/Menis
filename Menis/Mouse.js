Menis.Mouse = function (container)
{
	var self = this;

	Menis.Observable(self);

	var _isLeftButtonDown = false;

	self.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	container.addEventListener("mousedown", function (event)
	{
		event.preventDefault();

		_isLeftButtonDown = true;

		self.trigger(Menis.Events.MOUSE_DOWN, { x: event.pageX - this.offsetLeft, y: event.pageY - this.offsetTop, target: self, originalEvent: event });
	}, true);

	container.addEventListener("mouseup", function (event)
	{
		event.preventDefault();

		_isLeftButtonDown = false;
		self.trigger(Menis.Events.MOUSE_UP, { x: event.pageX - this.offsetLeft, y: event.pageY - this.offsetTop, target: self, originalEvent: event });
	}, true);

	container.addEventListener("mousewheel", function (event)
	{
		event.preventDefault();

	    self.trigger(Menis.Events.MOUSE_WHEEL, { x: event.pageX - this.offsetLeft, y: event.pageY - this.offsetTop, target: self, delta: event.wheelDelta, originalEvent: event });
	}, true);

	container.addEventListener("mouseenter", function (event)
	{
		event.preventDefault();

	    self.trigger(Menis.Events.MOUSE_ENTER, { x: event.pageX - this.offsetLeft, y: event.pageY - this.offsetTop, target: self, originalEvent: event });
	}, true);

	container.addEventListener("mouseleave", function (event)
	{
		event.preventDefault();

	    self.trigger(Menis.Events.MOUSE_LEAVE, { x: event.pageX - this.offsetLeft, y: event.pageY - this.offsetTop, target: self, originalEvent: event });
	}, true);
};