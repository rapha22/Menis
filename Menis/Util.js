Menis.Util =
{
	max: function (arr, selector) {
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

	extend: function (target, source) {
		if (target === null || typeof target !== 'object') return;
		if (source === null || typeof source !== 'object') return;

		var keys = Object.getOwnPropertyNames(source);

		for (var i = 0, l = keys.length; i < l; i++) {
			target[keys[i]] = source[keys[i]];
		}
	},

	ns: function (namespace, callback) {
		var parts = namespace.split('.');
		var current = eval('(typeof ' + parts[0] + ' !== "undefined") ? ' + parts[0] + ' : undefined') || {};
		parts.slice(1).forEach(function (p) {
			current[p] = current[p] || {};
			current = current[p];
		});
		if (callback) callback(current);
		return current;
	}
};