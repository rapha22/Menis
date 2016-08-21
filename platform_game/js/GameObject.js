Menis.Game.GameObjects = new function () {
	var objects = new Menis.BufferedList(1000);

	this.add = function add(obj) {
		objects.add(obj);
	};

	this.remove = function remove(obj) {
		objects.remove(obj);
	}

	this.update = function update() {
		objects.forEach(function (o) {
			if (o.update) o.update();
		});
	};
};

Menis.Game.GameObject = function GameObject(target) {
	Menis.Game.GameObjects.add(this);

	target.remove = function () {
		Menis.Game.GameObjects.remove(this);
		if(this.ui) this.ui.remove();
	};
}