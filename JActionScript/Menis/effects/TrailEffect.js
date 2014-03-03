Menis.effects.TrailEffect = function ()
{
	var _lastPosition = null;

	this.drawFunc = function (g, e)
	{
		if (!_lastPosition)
		{
			_lastPosition = { x: e.x, y: e.y };
			return;
		}

		g.moveTo(_lastPosition.x, _lastPosition.y);

		_lastPosition = { x: e.x, y: e.y };
	};
};

Menis.effects.TrailEffect.prototype = new Menis.effects.EffectBase();