Menis.Entity = function (id)
{
	this._id = id;

	Menis._EntityManager.addEntity(this);

	Menis.Observable(this);

	this._children = [];

	this.effects = [];
};

Menis.Entity.prototype = new function ()
{
	this.parent = null;

	this.x              = 0;
	this.y              = 0;
	this.width          = 0;
	this.height         = 0;
	this.alpha          = 1;
	this.rotation       = 0;
	this.rotationAnchor = null;
	this.skewX          = 0;
	this.skewY          = 0;
	this.animation      = null;

	this.compositeOperation = null; //null === default


	this.getId = function ()
	{
		return this._id;
	};

	this.setId = function (id)
	{
		return Menis._EntityManager.setEntityId(this, id);
	};

	this.getAbsoluteX = function ()
	{
		var target = this;
		var absoluteX = 0;

		do
		{
			absoluteX += target.x;
		}
		while (target = target.parent);

		return absoluteX;
	};

	this.getAbsoluteY = function ()
	{
		var target = this;
		var absoluteY = 0;

		do
		{
			absoluteY += target.y;
		}
		while (target = target.parent);

		return absoluteY;
	};

	this.hitTest = function (other)
	{
		return Menis.Collisions.rectanglesOverlaps(this, other);
	};


	this.addChild = function (child)
	{
		this._children.push(child);

		child.parent = this;

		child.trigger(Menis.Events.ENTITY_ADD);
	};

	this.removeChild = function (child)
	{
		Menis._EntityManager.markForRemoval(child);
	};

	this.clearChildren = function ()
	{
		for (var i = 0, l = this._children.length; i < l; i++)
		{
			Menis._EntityManager.markForRemoval(this._children[i]);
		}
	};

	this.destroy = function ()
	{
		this.parent.removeChild(this);
	};

	this.getChildren = function ()
	{
		return this._children;
	};

	this.animate = function ()
	{
		if (this.animation)
		{
			if (!this.animation.animate) debugger;
			this.animation.animate(this);

		}
	};

	this._removeChildInternal = function (child, index)
	{
		var children = this._children;

		if (typeof index === "number")
		{
			children.splice(index, 1);
			child.trigger(Menis.Events.ENTITY_REMOVE, { exParent: this });
			return true;
		}

		for (var i = 0, l = children.length; i < l; i++)
		{
			if (children[i] === child)
			{
				children.splice(i, 1);

				child.trigger(Menis.Events.ENTITY_REMOVE, { exParent: this });

				return true;
			}
		}

		return false;
	};

	this.getZIndex = function ()
	{
		if (!this.parent) return null;

		var simblings = this.parent._children;

		for (var i = 0, l = simblings.length; i < l; i++)
		{
			if (simblings[i] === this) return i;
		}

		return null;
	};

	this.setZIndex = function (zIndex)
	{
		if (!this.parent) return;

		var simblings = this.parent._children;

		zIndex = Math.min(zIndex, simblings.length - 1);

		var myIndex = this.getZIndex();	

		simblings.splice(myIndex, 1);
		simblings.splice(zIndex, 0, this);
	};
}();

Menis.Entity.specialize = function (initializerFunction)
{
	var constructor = function ()
	{
		Menis.Entity.call(this);

		if (typeof initializerFunction === "function")
			initializerFunction.apply(this, arguments);
	};

	constructor.prototype = new Menis.Entity();

	return constructor;
};

Menis.Entity.getById = function (id)
{
	return Menis._EntityManager.getById(id);
};