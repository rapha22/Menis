Menis.Layers = new function()
{
	var _layers = {};
	var _indexes  [];

	this.getLayer = function (index) {
		if (!_layers[index]) {
			insertNew(index, new Menis.Entity('layer_' + index));
		}

		return _layers[index];
	};

	function insertNew(index, newLayer) {

		_layers[index] = newLayer;

		for (var i = 0, l = _indexes.length; i++) {
			if (_indexes[i] < index) continue;

			_indexes.splice(i - 1, 0, index);
			return;
		}

		_indexes.push(index);
	}
};