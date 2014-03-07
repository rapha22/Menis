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
		if (entity._id && (entity._id in _entitiesDictionary))
			throw new Error("An entity with the ID " + entity._id + " already exists.");

		if (!entity._id)
		{
			while (entity._id in _entitiesDictionary)
				entity._id = "e_" + (new Date().getTime()) + "_" + ~~(Math.random() * 100000);
		}

		_entitiesDictionary[entity._id] = entity;
	};

	this.removeEntity = function (entity)
	{
		return delete _entitiesDictionary[entity._id];
	};

	this.getById = function (id)
	{
		return _entitiesDictionary[id];
	};

	this.setEntityId = function (entity, newId)
	{
		if (newId in _entitiesDictionary)
			throw new Error("An entity with the ID " + newId + " already exists.");

		this.removeEntity(entity);

		entity._id = newId;

		this.addEntity(entity);
	};
}();