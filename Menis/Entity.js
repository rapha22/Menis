Menis.Entity = function (id)
{
	this._id = id;

	Menis._EntityManager.addEntity(this);

	Menis.Observable(this);

	this._children = [];

	var self = this;


	/* Events ------------------------------------------------------------------------------------- */
	var mouseHandlers = {};

	function handleMouse(e)
	{
		var absRect = self.getAbsoluteRectangle();
		if (e.x < absRect.left || e.x > absRect.right)  return;
		if (e.y < absRect.top  || e.y > absRect.bottom) return;

		e.localX = e.x - absRect.left;
		e.localY = e.y - absRect.top;

		var handlers = mouseHandlers[e.originalEvent.type];

		for (var i = 0, l = handlers.length; i < l; i++)
			handlers[i].apply(self, arguments);
	}

	this.on = function (eventName, handler)
	{
		switch(eventName)
		{
			case Menis.Events.MOUSE_DOWN:
			case Menis.Events.MOUSE_UP:
			case Menis.Events.MOUSE_WHEEL:
			case Menis.Events.MOUSE_MOVE:
			{
				var handlers = mouseHandlers[eventName] = mouseHandlers[eventName] || [];

				if (handlers.length === 0)
					Menis.mouse.addEventHandler(eventName, handleMouse);

				handlers.push(handler);
			}

			default:
				this.addEventHandler(eventName, handler);
		}
	};

	this.off = function (eventName, handler)
	{
		switch(eventName)
		{
			case Menis.Events.MOUSE_DOWN:
			case Menis.Events.MOUSE_UP:
			case Menis.Events.MOUSE_WHEEL:
			case Menis.Events.MOUSE_MOVE:
			{
				var handlers = mouseHandlers[eventName] = mouseHandlers[eventName] || [];

				var index = handlers.indexOf(handler);
				handlers.splice(index, 1);

				if (handlers.length === 0)
					Menis.mouse.removeEventHandler(eventName, handleMouse);
			}

			default:
				this.addEventHandler(eventName, handler);
		}
	};
	/* -------------------------------------------------------------------------------------------- */
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

	this._clippingRect = null;


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

		this._width = ~~(this._originalWidth * scaleX);
		this._height = ~~(this._originalHeight * scaleY);

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

	this.clipRect = function (x, y, width, height)
	{
		if (x === null) this._clippingRect = null;
		else this._clippingRect = { x: x, y: y, width: width, height: height };
	};

	this.drag = function (dragX, dragY, limitX1, limitX2, limitY1, limitY2)
	{
		var dragPoint = null;

		if (dragX === undefined) dragX = true;
		if (dragY === undefined) dragY = true;

		function mouseDown(e)
		{
			console.log('drag-down');
			dragPoint = {x: e.localX, y: e.localY};
		}

		function mouseUp(e)
		{
			console.log('drag-up');
			dragPoint = null;
			//this.off(Menis.Events.MOUSE_DOWN, mouseDown);
			//this.off(Menis.Events.MOUSE_MOVE, mouseMove);
			//this.off(Menis.Events.MOUSE_UP, mouseUp);
		}

		function mouseMove(e)
		{
			console.log('drag-move');
			if (!dragPoint) return;

			if (dragX)
			{
				this.x = e.x - dragPoint.x;

				if (this.x < limitX1) this.x = limitX1;
				if (this.x > limitX2) this.x = limitX2;
			}

			if (dragY)
			{
				this.y = e.y - dragPoint.y;

				if (this.y < limitY1) this.y = limitY1;
				if (this.y > limitY2) this.y = limitY2;
			}
		}

		this.on(Menis.Events.MOUSE_DOWN, mouseDown);
		this.on(Menis.Events.MOUSE_MOVE, mouseMove);
		this.on(Menis.Events.MOUSE_UP, mouseUp);
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