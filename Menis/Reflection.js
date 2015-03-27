Menis.Reflection = new function ()
{
	this.createObject = function (prototype)
	{
		var c = function () { };
		c.prototype = prototype;

		return new c();
	};

	this.construct = function (constructor, parameters)
	{
		var obj = this.createObject(constructor.prototype);
		constructor.apply(obj, parameters);

		return obj;
	};

	this.fill = function (target, source)
	{
		for (var key in source)
		{
			if (!source.hasOwnProperty(key)) return;

			target[key] = source[key];
		}

		return target;
	};

	this.create = function (constructor /*, ... */)
	{
		var parameters = [].slice.call(arguments, 1);
		var initializers = parameters.pop();

		var obj = this.construct(constructor, parameters);

		return this.fill(obj, initializers);
	};

	this.addProp = function (obj, name, getter, setter)
	{
		Object.defineProperty(
			obj,
			name,
			{ get: getter, set: setter, writeable: true, enumerable: true, deletable: false }
		);
	};
};