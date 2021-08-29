import Entity from "./Entity.js";

export default function Layers(root) {
	var _layers = {};
	var _indexes = [];

	root.layer = function (index) {
		return _layers[index] || (_layers[index] = create(index));
	};

	function create(index) {

		var newLayer = new Entity('layer_' + index);
		root.addChild(newLayer);

		newLayer.setZIndex(index);

		_layers[index] = newLayer;

		for (var i = 0, l = _indexes.length; i < l; i++) {
			if (_indexes[i] < index) continue;

			_indexes.splice(i, 0, index);
			return newLayer;
		}

		_indexes.push(index);
		return newLayer;
	};
};