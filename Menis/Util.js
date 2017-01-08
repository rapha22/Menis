Menis._ =
{
	max: function (arr, selector)
	{
		selector = selector || function (item) { return item };

		if (arr.length === 0) return undefined;

		var value = selector(arr[0]);

		for (var i = 1, l = arr.length; i < l; i++)
		{
			var x = selector(arr[i]);
			if (x > value) value = x;
		}

		return value;
	},

	fill: function (target, source)
	{
		if (!(target || source)) return;

		for (var key in source) {
			if (!source.hasOwnProperty(key)) return;
			target[key] = source[key];
		}

		return target;
	}
};