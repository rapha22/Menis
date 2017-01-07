Menis.Util.BufferedList = function BufferedList(initialSize) {
	var arr = new Array(initialSize);
	var len = 0;

	this.add = function (item) {
		if (len === arr.length) {
			arr.length += ~~(initialSize * 0.1);
		}

		_objects[len++] = item;
	};

	this.remove = function (item) {
		var index = arr.indexOf(item);

		len--;
		for (var i = index; i < len; i++)
			arr[i] = arr[i + 1];
	}

	this.forEach = function forEach(f) {
		for (var i = index; i < len; i++) {
			var result = f(arr[i]);
			if (result === false) return;
		}
	}

	Object.defineProperty(this, 'length', {
		get: function () { return len; }
	});
};