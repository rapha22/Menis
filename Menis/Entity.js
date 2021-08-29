import Observable from './Observable.js'
import EntityManager from './EntityManager.js'
import Events from './Events.js'

export default function Entity(id) {
	this._id = id;
	this._children = [];

	Entity._EntityManager.addEntity(this);
	Observable(this);


	/* Mouse events ------------------------------------------------------------------------------------- */
	this._mouseHandlers = {};

	this.on = function (eventName, handler)
	{
		switch(eventName)
		{
			case Events.MOUSE_DOWN:
			case Events.MOUSE_UP:
			case Events.MOUSE_WHEEL:
			case Events.MOUSE_MOVE:
			{
				var handlers = this._mouseHandlers[eventName] = this._mouseHandlers[eventName] || [];

				if (handlers.length === 0)
					Menis.mouse.addEventHandler(eventName, this._handleMouse);

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
			case Events.MOUSE_DOWN:
			case Events.MOUSE_UP:
			case Events.MOUSE_WHEEL:
			case Events.MOUSE_MOVE:
			{
				var handlers = this._mouseHandlers[eventName] = this._mouseHandlers[eventName] || [];

				var index = handlers.indexOf(handler);
				handlers.splice(index, 1);

				if (handlers.length === 0)
					Menis.mouse.removeEventHandler(eventName, this._handleMouse);
			}

			default:
				this.addEventHandler(eventName, handler);
		}
	};
	/* -------------------------------------------------------------------------------------------- */
};

Entity.prototype = new function ()
{
	this.parent          = null;

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

	Object.defineProperty(this, 'id', {
		get: function () { return this._id; },
		set: function (id) { return Entity._EntityManager.setEntityId(this, id); }
	});

	Object.defineProperty(this, 'width', {
		get: function () { return this._width; },
		set: function (w)
		{
			this._originalWidth = w;
			this._scaleSize();
		}
	});

	Object.defineProperty(this, 'height', {
 		get: function () { return this._height; },
		set: function (h)
		{
			this._originalHeight = h;
			this._scaleSize();
		}
	});

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
			right:  absoluteX + this.width,
			bottom: absoluteY + this.height
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

		child.trigger(Events.ENTITY_ADD);
	};

	this.removeChild = function (child)
	{
		Entity._EntityManager.markForRemoval(child);
	};

	this.clearChildren = function ()
	{
		for (var i = 0, l = this._children.length; i < l; i++)
		{
			Entity._EntityManager.markForRemoval(this._children[i]);
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

	this.animate = function (renderer)
	{
		if (this._animation)
			this._animation.animate(renderer, this);
	};

	this._removeChildInternal = function (child)
	{
		var children = this._children;

		for (var i = 0, l = children.length; i < l; i++)
		{
			if (children[i] === child)
			{
				children.splice(i, 1);

				child.trigger(Events.ENTITY_REMOVE, { exParent: this });

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
			//this.off(Events.MOUSE_DOWN, mouseDown);
			//this.off(Events.MOUSE_MOVE, mouseMove);
			//this.off(Events.MOUSE_UP, mouseUp);
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

		this.on(Events.MOUSE_DOWN, mouseDown);
		this.on(Events.MOUSE_MOVE, mouseMove);
		this.on(Events.MOUSE_UP, mouseUp);
	};

	this._handleMouse = function (e)
	{
		var absRect = this.getAbsoluteRectangle();
		if (e.x < absRect.left || e.x > absRect.right)  return;
		if (e.y < absRect.top  || e.y > absRect.bottom) return;

		e.localX = e.x - absRect.left;
		e.localY = e.y - absRect.top;

		var handlers = this._mouseHandlers[e.originalEvent.type];

		for (var i = 0, l = handlers.length; i < l; i++)
			handlers[i].apply(this, arguments);
	};

	this.enterframe    = function (handler) { this.on(Events.ENTER_FRAME, handler); };
	this.keyup         = function (handler) { Menis.key.on(Events.KEY_UP, handler); },
	this.keydown       = function (handler) { Menis.key.on(Events.KEY_DOWN, handler); },
	this.keydownalways = function (handler) { Menis.key.on(Events.KEY_DOWN_ALWAYS, handler); }
	this.mouseup       = function (handler) { this.on(Events.MOUSE_UP, handler); };
	this.mousedown     = function (handler) { this.on(Events.MOUSE_DOWN, handler); };
	this.mousewheel    = function (handler) { this.on(Events.MOUSE_WHEEL, handler); };
	this.mousemove     = function (handler) { this.on(Events.MOUSE_MOVE, handler); };
};

Entity.specialize = function (initializerFunction)
{
	var entitySpecializedContructor = function ()
	{
		Entity.call(this);

		if (typeof initializerFunction === "function")
			initializerFunction.apply(this, arguments);
	};

	entitySpecializedContructor.prototype = new Entity();

	return entitySpecializedContructor;
};

Entity.getById = function (id)
{
	return Entity._EntityManager.getById(id);
};

Entity._EntityManager = EntityManager;