Menis.Entity = function (id)
{
	this._id = id;

	Menis._EntityManager.addEntity(this);

	Menis.Observable(this);

	this._children = [];

	this.effects = [];

	var self = this;

	function setMouseEvents(eventType)
	{
		return function (handler)
		{
			if (self["_mouse_" + eventType])
			{
				Menis.mouse.removeEventHandler(Menis.Events.MOUSE_UP, self["_mouse_" + eventType]);
			}

			self["_mouse_" + eventType] = handler;
			Menis.mouse.addEventHandler(eventType, function (e)
			{
				var absRect = self.getAbsoluteRectangle();
				if (e.x < absRect.left || e.x > absRect.right)  return;
				if (e.y < absRect.top  || e.y > absRect.bottom) return;

				handler.apply(self, arguments);
			});
		}
	};

	this.onmousedown  = setMouseEvents(Menis.Events.MOUSE_DOWN);
	this.onmouseup    = setMouseEvents(Menis.Events.MOUSE_UP);
	this.onmousewheel = setMouseEvents(Menis.Events.MOUSE_WHEEL);
	this.onmousemove  = setMouseEvents(Menis.Events.MOUSE_MOVE);
};

Menis.Entity.prototype = new function ()
{
	this.parent = null;

	this.x               = 0;
	this.y               = 0;
	this._width          = 0;
	this._height         = 0;
	this.alpha           = 1;
	this.rotation        = 0;
	this.rotationAnchor  = null;
	//this.skewX           = 0; //No skew suppor yet
	//this.skewY           = 0;
	this._scaleX         = 1;
	this._scaleY         = 1;
	this._originalWidth  = null;
	this._originalHeight = null;
	this._animation      = null;

	this.compositeOperation = null; //null === default


	this.getId = function ()
	{
		return this._id;
	};

	this.setId = function (id)
	{
		return Menis._EntityManager.setEntityId(this, id);
	};

	this.getWidth = function () { return this._width; };
	this.getHeight = function () { return this._height; };

	this.setWidth = function (w)
	{
		this._originalWidth = w;
		this._scaleSize();
	};

	this.setHeight = function (h)
	{
		this._originalHeight = h;
		this._scaleSize();
	};

	this.setSize = function (w, h)
	{
		this._originalWidth = w;
		this._originalHeight = h;
		this._scaleSize();
	};

	this.scale = function (x, y)
	{
	    if (x !== undefined && y !== undefined)
	    {
	        this._scaleX = x;
	        this._scaleY = y;

	        this._scaleSize();
	    }
	    else
	    {
	        return { x: this._scaleX, y: this._scaleY };
	    }
	};

	//Resets the entity's size so that it respects scale. 
	this._scaleSize = function (parentScale)
	{
		parentScale = parentScale || { x: 1, y: 1 };

		var scaleX = parentScale.x * this._scaleX;
		var scaleY = parentScale.y * this._scaleY;

		this._width = this._originalWidth * scaleX;
		this._height = this._originalHeight * scaleY;

		var currentScale = { x: scaleX, y: scaleY };

		for (var i = 0, l = this._children.length; i < l; i++) {
			this._children[i]._scaleSize(currentScale);
		}
	};

	this.getAbsoluteRectangle = function ()
	{
		var target = this;
		var absoluteX = 0;
		var absoluteY = 0;

		do
		{

			var scaleX = target.parent ? target.parent._scaleX : 1;
			var scaleY = target.parent ? target.parent._scaleY : 1;

			absoluteX += target.x * scaleX;
			absoluteY += target.y * scaleY;
		}
		while (target = target.parent);

		return {
			x:      absoluteX,
			y:      absoluteY,
			top:    absoluteY,
			left:   absoluteX,
			right:  absoluteX + this.getWidth(),
			bottom: absoluteY + this.getHeight()
		};
	};

	this.hitTest = function (other)
	{
		return Menis.Collisions.rectanglesOverlaps(this.getRectangle(), other.getRectangle());
	};

	this.getRectangle = function ()
	{
		return {
			left:   this.x,
			right:  this.x + this._width,
			top:    this.y,
			bottom: this.y + this._height
		};
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

	this.getAnimation = function ()
	{
		return this._animation;
	};

	this.setAnimation = function (animation, suppressRestart, suppressInitialize)
	{
		this._animation = animation;

		if (!suppressInitialize && animation.initialize)
			animation.initialize(this);

		if (!suppressRestart) animation.restart();

		return animation;
	};

	this.animate = function ()
	{
		if (this._animation)
			this._animation.animate(this);
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
	var entitySpecializedContructor = function ()
	{
		Menis.Entity.call(this);

		if (typeof initializerFunction === "function")
			initializerFunction.apply(this, arguments);
	};

	entitySpecializedContructor.prototype = new Menis.Entity();

	return entitySpecializedContructor;
};

Menis.Entity.getById = function (id)
{
	return Menis._EntityManager.getById(id);
};