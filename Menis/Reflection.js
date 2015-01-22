Menis.namespace = function (name, func)
{
	var parts = name.split(".");

	var ns = (1, eval)("this");

	for (var i = 0, l = parts.length; i < l; i++)
	{
		if (!ns.hasOwnProperty(parts[i]))
			ns[parts[i]] = {};

		ns = ns[parts[i]];
	}

	func(ns);
};

Menis.namespace("Menis.Reflection", function (ns)
{
	ns.createObject = function (prototype)
	{
		var c = function () { };
		c.prototype = prototype;

		return new c();
	};

	ns.construct = function (constructor, parameters)
	{
		var obj = ns.createObject(constructor.prototype);
		constructor.apply(obj, parameters);

		return obj;
	};

	ns.fill = function (target, source)
	{
		for (var key in source)
		{
			if (!source.hasOwnProperty(key)) return;

			target[key] = source[key];
		}

		return target;
	};

	ns.create = function (constructor /*, ... */)
	{
		var parameters = [].slice.call(arguments, 1);
		var initializers = parameters.pop();

		var obj = ns.construct(constructor, parameters);

		return ns.fill(obj, initializers);
	};
});

