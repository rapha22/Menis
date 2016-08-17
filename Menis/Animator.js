Menis.Animator = new function ()
{
	var _hasStarted = false;
	var _intervalId = null;
	var _frameRate = 30;
	var DEFAULT_FRAME_RATE = 30;

	this.animate = function ()
	{
		Menis._entityManager.triggerEnterFrameEvents(Menis.root);

		Menis._entityManager.removeMarkedEntities();

		Menis.renderer.render([Menis.root]);
	};

	this.start = function ()
	{
		_hasStarted = true;

		var speed = Math.floor(1000 / _frameRate);

		_intervalId = setInterval(this.animate, speed);
	};

	this.stop = function ()
	{
		_hasStarted = false;

		clearInterval(_intervalId);
		_intervalId = null;
	};

	this.setFrameRate = function (frameRate)
	{
		_frameRate = frameRate;

		if (_hasStarted)
		{
			this.stop();
			this.start();
		}
	};
}();