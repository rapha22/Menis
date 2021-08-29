export default function Observable(target) {
	var _handlers = Object.create(null);

	target.addEventHandler = function (eventName, handler)
	{
		_handlers[eventName] = _handlers[eventName] || [];

		_handlers[eventName].push(handler);
	};

	target.removeEventHandler = function (eventName, handler)
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

	target.clearHandlers = function (event)
	{
		_handlers[event] = [];
	};

	target.trigger = function (eventName, eventData)
	{
		var list = _handlers[eventName];

		if (!list || !list.length) return;

		for (var i = 0; i < list.length; i++)
		{
			list[i].call(target, eventData);
		}
	};


	target.on = target.addEventHandler;
	target.off = target.removeEventHandler;
};