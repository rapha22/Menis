Menis._EntityManager = new function ()
{
	var _entitiesDictionary = {};
	var _entitiesToRemove = [];

	this.triggerEnterFrameEvents = function (entity)
	{
		if (entity._willBeRemoved) return;

		entity.trigger(Menis.Events.ENTER_FRAME);

		var children = entity.getChildren();

		for (var i = 0, l = children.length; i < l; i++)
		{
			this.triggerEnterFrameEvents(children[i]);
		}
	};

	this.markForRemoval = function (entity)
	{
		entity._willBeRemoved = true; //Prevents ENTER_FRAME events of being triggered.
		_entitiesToRemove.push(entity); //Add to the removal list.
	};

	this.removeMarkedEntities = function ()
	{
		for (var i = 0, l = _entitiesToRemove.length; i < l; i++)
		{
			var e = _entitiesToRemove[i];
			e.parent._removeChildInternal(e);

			this.removeEntity(e);
		}

		_entitiesToRemove = [];
	};

	this.addEntity = function (entity)
	{
		if (!entity.id) entity.id = "e_" + (new Date().getTime()) + "_" + ~~(Math.random() * 100000);

		if (entity.id in _entitiesDictionary)
			throw new Error("An entity with the ID " + entity.id + " already exists.");

		_entitiesDictionary[entity.id] = entity;
	};

	this.removeEntity = function (entity)
	{
		return delete _entitiesDictionary[entity.id];
	};

	this.getById = function (id)
	{
		return _entitiesDictionary[id];
	};
}();