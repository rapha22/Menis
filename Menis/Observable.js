Menis.Observable = function (entity)
{
	var _handlers = Object.create(null);

	entity.addEventHandler = function (eventName, handler)
	{
		_handlers[eventName] = _handlers[eventName] || [];

		_handlers[eventName].push(handler);
	};

	entity.removeEventHandler = function (eventName, handler)
	{
		var list = _handlers[eventName];

		if (!list || !list.length) return false;

		for (var i = 0; i < list.length; i++)
		{
			if (list[i] === handler)
			{
				list.splice(i--, 1);
			}
		}

		return false;
	};

	entity.clearHandlers = function (event)
	{
		_handlers[event] = [];
	};

	entity.trigger = function (eventName, eventData)
	{
		var list = _handlers[eventName];

		if (!list || !list.length) return;

		for (var i = 0; i < list.length; i++)
		{
			list[i].call(entity, eventData);
		}
	};

};