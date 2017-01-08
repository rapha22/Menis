(function (global) {
function Menis(canvas)
{
	Menis.key             = new Menis.Key();
	Menis.mouse           = new Menis.Mouse(canvas);
	Menis.animator        = Menis.Animator;
	Menis.renderer        = new Menis.Renderer(canvas);
	Menis.resourceManager = new Menis.ResourceManager();
	Menis._entityManager  = Menis._EntityManager;

	Menis.root = new Menis.Entity('root');
	Menis.root.setSize(canvas.width, canvas.height);
	Menis._Layers(Menis.root);

	Menis.start = function () { Menis.Animator.start(); };
	Menis.stop  = function () { Menis.Animator.stop();  };

	Menis.Animator.animate = function ()
	{
		Menis._entityManager.triggerEnterFrameEvents(Menis.root);

		Menis._entityManager.removeMarkedEntities();

		Menis.renderer.render([Menis.root]);
	};

	canvas.addEventListener('mousedown', function () { canvas.focus(); });
}
Menis._ = new function ()
{
};
Menis.Observable = function (target)
{
	var _handlers = Object.create(null);

	target.addEventHandler = function (eventName, handler)
	{
		_handlers[eventName] = _handlers[eventName] || [];

		_handlers[eventName].push(handler);
	};

	target.removeEventHandler = function (eventName, handler)
	{
		var list = _handlers[eventName];

		if (!list || !list.length) return false;

		for (var i = 0; i < list.length; i++)
		{
			if (list[i] === handler)
			{
				list.splice(i--, 1);
			}
		}

		return false;
	};

	target.clearHandlers = function (event)
	{
		_handlers[event] = [];
	};

	target.trigger = function (eventName, eventData)
	{
		var list = _handlers[eventName];

		if (!list || !list.length) return;

		for (var i = 0; i < list.length; i++)
		{
			list[i].call(target, eventData);
		}
	};


	target.on = target.addEventHandler;
	target.off = target.removeEventHandler;
};
Menis.Entity = function (id)
{
	this._id = id;
	this._children = [];

	Menis._EntityManager.addEntity(this);
	Menis.Observable(this);


	/* Mouse events ------------------------------------------------------------------------------------- */
	this._mouseHandlers = {};

	this.on = function (eventName, handler)
	{
		switch(eventName)
		{
			case Menis.Events.MOUSE_DOWN:
			case Menis.Events.MOUSE_UP:
			case Menis.Events.MOUSE_WHEEL:
			case Menis.Events.MOUSE_MOVE:
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
			case Menis.Events.MOUSE_DOWN:
			case Menis.Events.MOUSE_UP:
			case Menis.Events.MOUSE_WHEEL:
			case Menis.Events.MOUSE_MOVE:
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

Menis.Entity.prototype = new function ()
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
		set: function (id) { return Menis._EntityManager.setEntityId(this, id); }
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

	this._removeChildInternal = function (child)
	{
		var children = this._children;

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

	this.enterframe    = function (handler) { this.on(Menis.Events.ENTER_FRAME, handler); };
	this.keyup         = function (handler) { Menis.key.on(Menis.Events.KEY_UP, handler); },
	this.keydown       = function (handler) { Menis.key.on(Menis.Events.KEY_DOWN, handler); },
	this.keydownalways = function (handler) { Menis.key.on(Menis.Events.KEY_DOWN_ALWAYS, handler); }
	this.mouseup       = function (handler) { this.on(Menis.Events.MOUSE_UP, handler); };
	this.mousedown     = function (handler) { this.on(Menis.Events.MOUSE_DOWN, handler); };
	this.mousewheel    = function (handler) { this.on(Menis.Events.MOUSE_WHEEL, handler); };
	this.mousemove     = function (handler) { this.on(Menis.Events.MOUSE_MOVE, handler); };
};

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
Menis._EntityManager = new function ()
{
	var _entitiesDictionary = Object.create(null);
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

			delete _entitiesDictionary[e._id];
		}

		_entitiesToRemove = [];
	};

	this.addEntity = function (entity)
	{
		if (entity._id && (entity._id in _entitiesDictionary))
			throw new Error("An entity with the ID " + entity._id + " already exists.");

		if (!entity._id)
		{
			do
			{
				entity._id = "e_" + (new Date().getTime()) + "_" + ~~(Math.random() * 100000);
			}
			while (entity._id in _entitiesDictionary);
		}

		_entitiesDictionary[entity._id] = entity;
	};

	this.getById = function (id)
	{
		return _entitiesDictionary[id];
	};

	this.setEntityId = function (entity, newId)
	{
		if (newId in _entitiesDictionary)
			throw new Error("An entity with the ID " + newId + " already exists.");

		var oldId = entity._id;

		entity._id = newId;

		_entitiesDictionary[newId] = entity;
		delete _entitiesDictionary[oldId];
	};
}();
Menis.UI = Menis.UI || {};
Menis.UI.ScrollPanel = Menis.Entity.specialize(function (x, y, width, height)
{
	var panel = this;

	var container = new Menis.Entity();
	panel.addChild(container);

	panel.scrollBarBackgroundColor = '#COCOCO';
	panel.scrollBarForegroundColor = 'whitesmoke';
	panel.scrollBarSize = 20;

	var childVisibilityX = 0;
	var childVisibilityY = 0;

	//panel.clipRect(x, y, width, height);


	var horizontalBar = createHorizontalBar();
	var verticalBar = createVerticalBar();

	panel.addChild = function (child)
	{
		container.addChild(child);
	};

	panel.on(Menis.Events.ENTER_FRAME, function ()
	{
		var cs = container.getChildren();
		var containerWidth  = Menis._.max(cs, function (c) { return c.x + c.width });
		var containerHeight = Menis._.max(cs, function (c) { return c.y + c.height });

		childVisibilityX = Math.min(width / containerWidth, 1);
		childVisibilityY = Math.min(height / containerHeight, 1);
	});

	function createHorizontalBar()
	{
		var bar = new Menis.Entity();
		var scroll = new Menis.Entity();

		bar.perc = 0;

		bar.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarBackgroundColor;
			g.fillRect(0, 0, width, panel.scrollBarSize);
		}));

		scroll.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarForegroundColor;
			g.fillRect(0, 0, width * childVisibilityX, panel.scrollBarSize);

			scroll.setSize(width * childVisibilityX, panel.scrollBarSize);
		}));

		scroll.on(Menis.Events.MOUSE_MOVE, function (e)
		{
			if (!Menis.mouse.isDown()) return;

			scroll.x += e.originalEvent.movementX;

			if (scroll.x < 0)
				scroll.x = 0;

			if (scroll.x + scroll.width > width)
				scroll.x = width - scroll.width;

			bar.perc = scroll.x / (width - scroll.width);
		});

		bar.addChild(scroll);

		bar.y = height;

		panel.addChild(bar);

		return bar;
	}

	function createVerticalBar()
	{
		var bar = new Menis.Entity();
		var scroll = new Menis.Entity();

		bar.perc = 0;

		bar.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarBackgroundColor;
			g.fillRect(0, 0, panel.scrollBarSize, height);
		}));

		scroll.setAnimation(new Menis.CodeAnimation(function (g)
		{
			g.fillStyle = panel.scrollBarForegroundColor;
			g.fillRect(0, 0, panel.scrollBarSize, height * childVisibilityY);

			scroll.setSize(width * childVisibilityX, panel.scrollBarSize);
		}));

		scroll.on(Menis.Events.MOUSE_MOVE, function (e)
		{
			if (!Menis.mouse.isDown()) return;

			scroll.y += e.originalEvent.movementY;

			if (scroll.y < 0)
				scroll.y = 0;

			if (scroll.y + scroll.height > height)
				scroll.y = height - scroll.height;

			bar.perc = scroll.y / (height - scroll.height);
		});

		bar.addChild(scroll);

		bar.x = width;

		panel.addChild(bar);

		return bar;
	}
});
Menis.UI = Menis.UI || {};
Menis.UI.Text = Menis.Entity.specialize(function (text)
{
	var self = this;

	self.text = text;
	self.fontName = null;
	self.fontSize = null;
	self.color = "#000000";

	self.setAnimation(new Menis.CodeAnimation(function (g)
	{
		if (!self.text) return;

		g.textBaseline = "top";
		g.font = self.fontSize + " " + self.fontName;
		g.fillStyle = self.color;
		g.fillText(self.text, 0, 0);
	}));
});
Menis.Animation = function ()
{
	this.actions = [];
};

Menis.AnimationStyles =
{
	NORMAL:  "normal",
	REVERSE: "reverse",
	YOYO:    "yoyo",


	getAnimationStyleFunc: function (style)
	{
		return this.factories[style]();
	},


	factories:
	{
		"normal": function ()
		{
			return function (frameIndex, frameCount) { return (frameIndex + 1) % frameCount; };
		},

		"reverse": function ()
		{
			return function (frameIndex, frameCount)
			{
				frameIndex--;

				if (frameIndex < 0)
					return Math.max(frameCount - 1, 0);

				return frameIndex;
			};
		},

		"yoyo": function ()
		{
			var incrementer = 1;

			return function (frameIndex, frameCount)
			{
				frameIndex += incrementer;

				if (frameIndex <= 0 || frameIndex >= frameCount - 1)
					incrementer *= -1;

				return frameIndex;
			};
		}
	}
};

Menis.Animation.prototype = new function ()
{
	this._animationStyleFunc = null;

	this.frameDelay       = 0;
	this.frameIndex       = 0;
	this._frameDelayAux   = 0;
	this.reverseAnimation = false;
	this.drawFrame        = null;
	this.initialize       = null;
	this.style            = Menis.AnimationStyles.NORMAL;
	this.flipHorizontally = false;
	this.flipVertically   = false;
	this._playing         = true;
	this.visible          = true;

	this.getFramesCount = function ()
	{
		return (this.getFrameCount && this.getFrameCount()) || 0;
	};

	this.animate = function (entity)
	{
		if (!this.visible) return;

		var g = Menis.renderer.getGraphics();

		if (this.flipHorizontally)
		{	
			var xScale = 1 / entity._scaleX;

			g.scale(xScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale (scale's behaviour is a cummulative).

			g.translate(entity.width, 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
		}

		if (this.flipVertically)
		{
			var yScale = 1 / entity._scaleY;

			g.scale(yScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale (scale's behaviour is a cummulative).

			g.translate(entity.height, 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
		}


		this.drawFrame(entity, this.frameIndex);

		
		if (this._frameDelayAux < this.frameDelay)
		{
			this._frameDelayAux++;
			return;
		}

		this._frameDelayAux = 0;


		if (typeof this.actions[this.frameIndex] === "function")
		{
			this.actions[this.frameIndex].call(this, entity);
		}

		if (!this._playing) return;

		if (!this._animationStyleFunc)
			this._animationStyleFunc = Menis.AnimationStyles.getAnimationStyleFunc(this.style);

		this.frameIndex = this._animationStyleFunc(this.frameIndex, this.getFramesCount());
	};

	this.isPlaying = function ()
	{
		return this._playing;
	};

	this.play = function ()
	{
		this._playing = true;
	};	

	this.stop = function ()
	{
		this._playing = false;
	};

	this.restart = function ()
	{
		this.frameIndex = 0;
		this._frameDelayAux = 0;

		this.play();
	};
}();
Menis.Animator = new function ()
{
	var _hasStarted = false;
	var _intervalId = null;
	var _frameRate = 30;
	var DEFAULT_FRAME_RATE = 30;

	this.animate = null; //Hook

	this.start = function ()
	{
		_hasStarted = true;

		var speed = Math.floor(1000 / _frameRate);

		_intervalId = setInterval(this.animate, speed);
	};

	this.stop = function ()
	{
		_hasStarted = false;

		clearInterval(_intervalId);
		_intervalId = null;
	};

	this.setFrameRate = function (frameRate)
	{
		_frameRate = frameRate;

		if (_hasStarted)
		{
			this.stop();
			this.start();
		}
	};
}();
Menis.CodeAnimation = function (drawingFunctions)
{
	if (typeof drawingFunctions === "function")
		this.drawingFunctions = [drawingFunctions];
	else
		this.drawingFunctions = drawingFunctions;
}

Menis.CodeAnimation.prototype = new Menis.Animation();

Menis.CodeAnimation.prototype.drawFrame = function (entity, frameIndex)
{
	if (!this.drawingFunctions.length) return;

	this.drawingFunctions[frameIndex](Menis.renderer.getGraphics(), entity);
};

Menis.CodeAnimation.prototype.getFramesCount = function ()
{
	return this.drawingFunctions.length;
};
Menis.Collisions = {

	between: function (value, start, end) {
		return value >= start && value <= end;
	},

	rectanglesOverlaps: function (a, b) {
		return Menis.Collisions.rectanglesOverlapsX(a, b) && Menis.Collisions.rectanglesOverlapsY(a, b);
	},

	rectanglesOverlapsX: function (a, b) {
		return (
			   this.between(a.left,  b.left, b.right)
			|| this.between(a.right, b.left, b.right)
			|| this.between(b.left,  a.left, a.right)
			|| this.between(b.right, a.left, a.right)
		);
	},

	rectanglesOverlapsY: function (a, b) {
		return (
			   this.between(a.top,    b.top, b.bottom)
			|| this.between(a.bottom, b.top, b.bottom)
			|| this.between(b.top,    a.top, a.bottom)
			|| this.between(b.bottom, a.top, a.bottom)
		);
	},

	getOverlappingRectangle: function (a, b) {
		var y1;
		if (a.top >= b.top && a.top <= b.bottom) y1 = a.top;
		else if (b.top >= b.top && b.top <= b.bottom) y1 = b.top;

		var y2;
		if (a.bottom >= b.top && a.bottom <= b.bottom) y2 = a.bottom;
		else if (b.bottom >= a.top && b.bottom <= a.bottom) y2 = b.bottom;

		var x1;
		if (a.left >= b.left && a.left <= b.right) x1 = a.left;
		else if (b.left >= a.left && b.left <= a.right) x1 = b.left;

		var x2;
		if (a.right >= b.left && a.right <= b.right) x2 = a.right;
		else if (b.right >= a.left && b.right <= a.right) x2 = b.right;

		if (y1 === undefined) return null;
		if (y2 === undefined) return null;
		if (x1 === undefined) return null;
		if (x2 === undefined) return null;

		return {
			top:    Math.min(y1, y2),
			bottom: Math.max(y1, y2),
			left:   Math.min(x1, x2),
			right:  Math.max(x1, x2)
		};
	}
};
Menis.Events =
{
	ENTER_FRAME:     "enterframe",
	KEY_DOWN:        "keydown",
	KEY_DOWN_ALWAYS: "keydownalways",
	KEY_UP:          "keyup",
	ENTITY_ADD:      "entityadd",
	ENTITY_REMOVE:   "entityremove",
	RESOURCE_LOADED: "resourceloaded",
	RESOURCE_ERROR:  "resourceerror",
	MOUSE_UP:        "mouseup",
	MOUSE_DOWN:      "mousedown",
    MOUSE_WHEEL:     "mousewheel",
    MOUSE_MOVE:      "mousemove",
    DRAG:            "drag"
};
Menis.ImageAnimation = function (urls)
{
	if (typeof urls === "string") urls = [urls];

	if (!Array.isArray(urls) | !urls.length)
		throw new TypeError("An image animation must be buit with an array of at least one image URL.");

	this.urls = urls;
};

Menis.ImageAnimation.prototype = new Menis.Animation();

Menis.ImageAnimation.prototype.drawFrame = function (entity)
{
	var img = Menis.resourceManager.getResource(
		this.urls[this.frameIndex]
	);

	entity.setSize(img.width, img.height);

	Menis.renderer.getGraphics().drawImage(img, 0, 0);
};

Menis.ImageAnimation.prototype.getFramesCount = function ()
{
	return this.urls.length;
};

Menis.image = function (url, inits, actions)
{
	var anim = new Menis.ImageAnimation(url);
	this._.fill(anim, inits);
	this._.fill(anim.actions, actions);
	return anim;
};
Menis.Key = function ()
{
	var self = this;

	Menis.Observable(self);

	var _pressingKeys = [];

	this.LEFT         = 37;
	this.UP           = 38;
	this.RIGHT        = 39;
	this.DOWN         = 40;
	this.SPACE        = 32;
	this.BACKSPACE    = 8;
	this.TAB          = 9;
	this.ENTER        = 13;
	this.SHIFT        = 16;
	this.CTRL         = 17;
	this.ALT          = 18;
	this.PAUSE_BREAK  = 19;
	this.CAPS_LOCK    = 20;
	this.ESC          = 27;
	this.PAGE_UP      = 33;
	this.PAGE_DOWN    = 34;
	this.END          = 35;
	this.HOME         = 36;
	this.INSERT       = 45;
	this.DELETE       = 46;
	this.WINDOWS_LEFT = 91;
	this.WINDOWS_RIGH = 92;
	this.NUMPAD_0     = 96;
	this.NUMPAD_1     = 97;
	this.NUMPAD_2     = 98;
	this.NUMPAD_3     = 99;
	this.NUMPAD_4     = 100;
	this.NUMPAD_5     = 101;
	this.NUMPAD_6     = 102;
	this.NUMPAD_7     = 103;
	this.NUMPAD_8     = 104;
	this.NUMPAD_9     = 105;
	this.MULTIPLY     = 106;
	this.PLUS         = 107;
	this.MINUS        = 109;
	this.DIVIDE       = 111;
	this.F1           = 112;
	this.F2           = 113;
	this.F3           = 114;
	this.F4           = 115;
	this.F5           = 116;
	this.F6           = 117;
	this.F7           = 118;
	this.F8           = 119;
	this.F9           = 120;
	this.F10          = 121;
	this.F11          = 122;
	this.F12          = 123;


	self.isDown = function (keyCode)
	{
		var code = keyCode;

		if (arguments.length > 1)
			code = [].slice.call(arguments, 0);

		if (Array.isArray(code))
		{
			var areDown = true;

			code.forEach(function (e) { areDown &= self.isDown(e); });

			return Boolean(areDown);
		}

		if (typeof keyCode === "number")
			return _pressingKeys[code];

		if (typeof keyCode === "string")
			return Boolean( _pressingKeys[code.toUpperCase().charCodeAt(0)] || _pressingKeys[code.toLowerCase().charCodeAt(0)] );

		throw new TypeError("The keyCode must be either a number, a string or an array of both types.");
	};

	self.equals = function (keyCode, targetKey)
	{
		if (typeof targetKey === "string")
		{
			var char = String.fromCharCode(keyCode);

			if (/[A-Za-z]/.test(char))
				return char.toUpperCase() === targetKey || char.toLowerCase() === targetKey;
		}

		return keyCode === targetKey;
	};


	function insertKey(key)
	{
		_pressingKeys[key] = true;
	}

	function removeKey(key)
	{
		_pressingKeys[key] = false;
	}


	document.body.addEventListener("keydown", function (event)
	{
		event.preventDefault();

		if (self.isDown(event.keyCode)) //Key is already pressed, but browser triggered the keydown event anyway.
		{
			self.trigger(Menis.Events.KEY_DOWN_ALWAYS, { keyCode: event.keyCode });
			return;
		}

		insertKey(event.keyCode);		

		self.trigger(Menis.Events.KEY_DOWN, { keyCode: event.keyCode });
	});	

	document.body.addEventListener("keyup", function (event)
	{
		event.preventDefault();

		var char = String.fromCharCode(event.keyCode);

		if (/[A-Za-z]/.test(char))
		{
			removeKey(char.toUpperCase().charCodeAt(0));
			removeKey(char.toLowerCase().charCodeAt(0));
		}
		else
		{
			removeKey(event.keyCode);
		}

		self.trigger(Menis.Events.KEY_UP, { keyCode: event.keyCode });
	});
};
Menis._Layers = function(root)
{
	var _layers = {};
	var _indexes = [];

	root.layer = function (index) {
		return _layers[index] || (_layers[index] = create(index));
	};

	function create(index) {

		var newLayer = new Menis.Entity('layer_' + index);
		Menis.root.addChild(newLayer);

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
Menis.Mouse = function (container)
{
	var self = this;

	Menis.Observable(self);

	var _isLeftButtonDown = false;

	self.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	self.x = 0;
	self.y = 0;

	function traceEventPosition(x, y)
	{
		if (!Menis.traceMouse) return;

		var g = Menis.renderer.getGraphics();

		g.save();
		
		g.lineWidth = 1;
		g.strokeStyle = "#FF00FF";
		
		g.beginPath();
		g.moveTo(0, y);
		g.lineTo(Menis.root.width, y);
		g.stroke();

		g.beginPath();
		g.moveTo(x, 0);
		g.lineTo(x, Menis.root.height);
		g.stroke();

		g.restore();
	}

	function eventDefaultAction(target, event)
	{
		event.preventDefault();

		var rect = target.getClientRects()[0];

		var doc = document.documentElement;

		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;

		self.x = x;
		self.y = y;

		if (Menis.debugMode) traceEventPosition(x, y);

		return {x: x, y: y};
	}

	container.addEventListener("mousedown", function (event)
	{
		_isLeftButtonDown = true;
		var pos = eventDefaultAction(this, event);
		self.trigger(Menis.Events.MOUSE_DOWN, { x: pos.x, y: pos.y, target: self, originalEvent: event });

	}, true);

	container.addEventListener("mouseup", function (event)
	{
		_isLeftButtonDown = false;
		var pos = eventDefaultAction(this, event);
		self.trigger(Menis.Events.MOUSE_UP, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, true);

	container.addEventListener("mousewheel", function (event)
	{
		var pos = eventDefaultAction(this, event);
	    self.trigger(Menis.Events.MOUSE_WHEEL, { x: pos.x, y: pos.y, target: self, delta: event.wheelDelta, originalEvent: event });
	}, true);

	container.addEventListener("mousemove", function (event)
	{
		var pos = eventDefaultAction(this, event);
	    self.trigger(Menis.Events.MOUSE_MOVE, { x: pos.x, y: pos.y, target: self, originalEvent: event });
	}, false);
};
Menis.Renderer = function (canvas)
{
	var self = this;

	var _mainGraphs = canvas.getContext("2d");

	var _buffer = document.createElement("canvas");
	_buffer.width = canvas.width;
	_buffer.height = canvas.height;

	var _graphs = _buffer.getContext("2d");

	if (Menis.debugMode) _graphs = _mainGraphs;


	//Animation ---------------------------------------------------------------------------------------
	self.render = function (entities)
	{
		_graphs.clearRect(0, 0, canvas.width, canvas.height);

		drawToBuffer(entities);

		if (Menis.debugMode) return;

		window.requestAnimationFrame(function ()
		{
			_mainGraphs.clearRect(0, 0, canvas.width, canvas.height);

			self.draw(_buffer, _mainGraphs);
		});
	};

	function drawToBuffer(entities)
	{
		var len = (entities && entities.length) || 0;

		for (var i = 0; i < len; i++)
		{
			_graphs.save();

			var ent = entities[i];

			applyTransformations(ent);

			if (Menis.debugMode)
			{
				_graphs.strokeStyle = "#FFFF00";
				_graphs.strokeRect(0, 0, ent._width, ent._height);
				_graphs.font = '10px sans-serif';
				_graphs.strokeText(ent._id, 5, 5);
			}

			ent.animate();

			drawToBuffer(ent.getChildren());

			_graphs.restore();
		}
	}

	function applyTransformations(ent)
	{
		//_graphs.setTransform(1, ent.skewX, ent.skewY, 1, 0, 0); //No skew support yet

		_graphs.globalAlpha = ent.alpha || 0;

		_graphs.globalCompositeOperation = ent.compositeOperation || "source-over";

		_graphs.translate(ent.x, ent.y);

		_graphs.scale(ent._scaleX, ent._scaleY);

		if (ent.rotation)
		{
			if (ent.rotationAnchor)
				_graphs.translate(ent.rotationAnchor.x, ent.rotationAnchor.y);

			_graphs.rotate(ent.rotation * Math.PI / 180);

			if (ent.rotationAnchor)
				_graphs.translate(ent.rotationAnchor.x * -1, ent.rotationAnchor.y * -1);
		}

		if (ent._clippingRect)
		{
			var c = ent._clippingRect;

			_graphs.beginPath();
			_graphs.rect(ent.x + c.x, ent.y + c.y, c.width, c.height);
			_graphs.clip();
		}
	}

	self.draw = function (bufferGraphics, mainGraphics)
	{
		mainGraphics.drawImage(bufferGraphics, 0, 0);
	};

	self.getGraphics = function ()
	{
		return _graphs;
	};

	self.setImageSmoothing = function (value)
	{
		_graphs.imageSmoothingEnabled = value;
	};
};
Menis.ResourceManager = function ()
{
	var self = this;

	Menis.Observable(self);

	var resources = Object.create(null);
	
	
	self.getResource = function (url, callback)
	{
		if (resources[url])
			return resources[url];

		var image = new Image();

		image.onload = function ()
		{
			resources[url] = image;

			self.trigger(Menis.Events.RESOURCE_LOADED, { loadedResource: image, success: true });

			if (callback) callback(image, true /* success */);
		};

		image.onerror = function ()
		{
			self.trigger(Menis.Events.RESOURCE_ERROR, { loadedResource: image, success: false });

			if (callback) callback(image, false /* no success */);
		};

		image.src = url;

		resources[url] = image;

		return image;
	};

	self.loadResources = function (urls, callback, progressCallback)
	{
		var count = urls.length;

		for (var i = 0, l = count; i < l; i++)
		{
			self.getResource(urls[i], function ()
			{
				if (!--count && callback) callback();
			});
		}
	};
}
Menis.SpritesheetAnimation = function (spritesheetSource, spriteWidth, spriteHeight)
{
	var _spritesheet = Menis.resourceManager.getResource(spritesheetSource);

	this.actions = [];

	this.initialize = function (entity)
	{
		entity.setSize(spriteWidth, spriteHeight);
	};

	this.drawFrame = function (entity, frameIndex)
	{
		if (!_spritesheet || !_spritesheet.src) return;

		Menis.renderer.getGraphics().drawImage(
			_spritesheet,
			spriteWidth * frameIndex,
			0,
			spriteWidth,
			spriteHeight,
			0,
			0,
			spriteWidth,
			spriteHeight
		);

		return this.actions[frameIndex];
	};

	this.getFramesCount = function ()
	{
		return ~~(_spritesheet.width / spriteWidth);
	};
};

Menis.SpritesheetAnimation.prototype = new Menis.Animation();

Menis.sprite = function (url, width, height, inits, actions)
{
	var anim = new Menis.SpritesheetAnimation(url, width, height);
	Menis._.fill(anim, inits);
	Menis._.fill(anim.actions, actions);
	return anim;
};
Menis._ =
{
	max: function (arr, selector)
	{
		selector = selector || function (item) { return item };

		if (arr.length === 0) return undefined;

		var value = selector(arr[0]);

		for (var i = 1, l = arr.length; i < l; i++)
		{
			var x = selector(arr[i]);
			if (x > value) value = x;
		}

		return value;
	},

	fill: function (target, source)
	{
		if (!(target || source)) return;

		for (var key in source) {
			if (!source.hasOwnProperty(key)) return;
			target[key] = source[key];
		}

		return target;
	}
};
global.Menis = Menis;

})(window);
