var GameObjectsManager = function () {
	var objects = Object.create(null);
	var lastId = 1;

	this.processFrame = function () {
		for (var id in objects)
			objects[id].processFrame();
	};

	this.add = function (o) {
		o._id = "obj_" + lastId++;
		objects[o._id] = o;
	};

	this.remove = function (o) {
		delete objects[o._id];
	};
};