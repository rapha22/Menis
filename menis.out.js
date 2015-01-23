(function (global) {                 
function Menis(canvas)
{
	Menis.key             = new Menis.Key();
	Menis.mouse           = new Menis.Mouse(canvas);
	Menis.animator        = Menis.Animator;
	Menis.renderer        = new Menis.Renderer(canvas);
	Menis.resourceManager = new Menis.ResourceManager();
	Menis._entityManager  = Menis._EntityManager;

	Menis.root = new Menis.Entity();
	Menis.root.setSize(canvas.width, canvas.height);


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
Menis.Animation = function (entity)
{
	this._animationStyleFunc = null;

	this.frameDelay       = 0;
	this.frameIndex       = 0;
	this._frameDelayAux   = 0;
	this.reverseAnimation = false;
	this.actions          = [];
	this.drawFrame        = null;
	this.initialize       = null;
	this.style            = Menis.AnimationStyles.NORMAL;
	this.flipHorizontally = false;
	this.flipVertically   = false;
	this._playing         = true;
	this.visible          = true;
};

Menis.Animation.prototype = new function ()
{
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

			g.scale(xScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale.

			g.translate(entity.getWidth(), 0);
			g.scale(-1, 1);

			g.scale(entity._scaleX, 1);
		}

		if (this.flipVertically)
		{
			var yScale = 1 / entity._scaleY;

			g.scale(yScale, 1); //Returns the scale to normal, so the flip will not be multiplied by the current scale.

			g.translate(entity.getHeight(), 0);
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
Menis.Animator = new function ()
{
	var _hasStarted = false;
	var _intervalId = null;
	var _frameRate = 30;
	var DEFAULT_FRAME_RATE = 30;

	this.animate = null;

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


	this.drawFrame = function (entity, frameIndex)
	{
		if (!drawingFunctions.length) return;

		this.drawingFunctions[frameIndex](Menis.renderer.getGraphics(), entity);
	};
	
	this.getFramesCount = function ()
	{
		return this.drawingFunctions.length;
	};
}

Menis.CodeAnimation.prototype = new Menis.Animation();    
Menis.Collisions = {};

Menis.Collisions.isInRange = function (value, start, end)
{
	return value >= start && value <= end;
}

Menis.Collisions.rectanglesOverlaps = function (a, b)
{
	var noOverlap = false;

	noOverlap |= a.left > b.right;
	noOverlap |= a.right < b.left;
	noOverlap |= a.top > b.bottom;
	noOverlap |= a.bottom < b.top;

	return !noOverlap;
}

Menis.Collisions.rectanglesOverlapsX = function (a, b)
{
	return this.isInRange(a.left, b.left, b.right) || this.isInRange(a.right, b.left, b.right);
}

Menis.Collisions.rectanglesOverlapsY = function (a, b)
{
	return this.isInRange(a.top, b.top, b.bottom) || this.isInRange(a.bottom, b.top, b.bottom);
}    
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
    MOUSE_MOVE:      "mousemove"
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
	var img = Menis.resourceManager.getImage(
		this.urls[this.frameIndex]
	);

	entity.setSize(img.width, img.height);

	Menis.renderer.getGraphics().drawImage(img, 0, 0);
};

Menis.ImageAnimation.prototype.getFramesCount = function ()
{
	return this.urls.length;
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
function Menis(canvas)
{
	Menis.key             = new Menis.Key();
	Menis.mouse           = new Menis.Mouse(canvas);
	Menis.animator        = Menis.Animator;
	Menis.renderer        = new Menis.Renderer(canvas);
	Menis.resourceManager = new Menis.ResourceManager();
	Menis._entityManager  = Menis._EntityManager;

	Menis.root = new Menis.Entity();
	Menis.root.setSize(canvas.width, canvas.height);


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
Menis.Mouse = function (container)
{
	var self = this;

	Menis.Observable(self);

	var _isLeftButtonDown = false;

	self.isDown = function ()
	{
		return _isLeftButtonDown;
	};

	function traceEventPosition(x, y)
	{
		var g = Menis.renderer.getGraphics();

		g.save();
		
		g.lineWidth = 1;
		g.strokeStyle = "#FF00FF";
		
		g.beginPath();
		g.moveTo(0, y);
		g.lineTo(Menis.root.getWidth(), y);
		g.stroke();

		g.beginPath();
		g.moveTo(x, 0);
		g.lineTo(x, Menis.root.getHeight());
		g.stroke();

		g.restore();
	}

	function eventDefaultAction(target, event)
	{
		event.preventDefault();

		var rect = target.getClientRects()[0];

		var borderWidth = target.style.borderWidth

		var x = event.pageX - rect.left;
		var y = event.pageY - rect.top;

		if (Menis.debugMode) traceEventPosition(x, y);

		return {x: x, y: y};
	}

	container.addEventListener("mousedown", function (event)
	{
		var pos = eventDefaultAction(this, event);
		self.trigger(Menis.Events.MOUSE_DOWN, { x: pos.x, y: pos.y, target: self, originalEvent: event });

	}, true);

	container.addEventListener("mouseup", function (event)
	{
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
Menis.Observable = function (entity)
{
	var _handlers = Object.create(null);

	entity.addEventHandler = function (eventName, handler)
	{
		_handlers[eventName] = _handlers[eventName] || [];

		_handlers[eventName].push(handler);
	};

	entity.removeEventHandler = function (eventName, handler)
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

	entity.clearHandlers = function (event)
	{
		_handlers[event] = [];
	};

	entity.trigger = function (eventName, eventData)
	{
		var list = _handlers[eventName];

		if (!list || !list.length) return;

		for (var i = 0; i < list.length; i++)
		{
			list[i].call(entity, eventData);
		}
	};

};    
Menis.Reflection = new function ()
{
	this.createObject = function (prototype)
	{
		var c = function () { };
		c.prototype = prototype;

		return new c();
	};

	this.construct = function (constructor, parameters)
	{
		var obj = this.createObject(constructor.prototype);
		constructor.apply(obj, parameters);

		return obj;
	};

	this.fill = function (target, source)
	{
		for (var key in source)
		{
			if (!source.hasOwnProperty(key)) return;

			target[key] = source[key];
		}

		return target;
	};

	this.create = function (constructor /*, ... */)
	{
		var parameters = [].slice.call(arguments, 1);
		var initializers = parameters.pop();

		var obj = this.construct(constructor, parameters);

		return this.fill(obj, initializers);
	};
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

		if (!Menis.debugMode)
		{
			_mainGraphs.clearRect(0, 0, canvas.width, canvas.height);

			self.draw(_buffer, _mainGraphs)
		}
	};

	function drawToBuffer(entities, parentExtraProps)
	{
		var len = (entities && entities.length) || 0;

		for (var i = 0; i < len; i++)
		{
			_graphs.save();

			var ent = entities[i];

			applyTransformations(ent);

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

		if (Menis.debugMode)
		{
			_graphs.strokeStyle = "#FFFF00";
			_graphs.strokeRect(0, 0, ent._width, ent._height);
		}

		_graphs.scale(ent._scaleX, ent._scaleY);

		if (ent.rotation)
		{
			if (ent.rotationAnchor)
				_graphs.translate(ent.rotationAnchor.x, ent.rotationAnchor.y);

			_graphs.rotate(ent.rotation * Math.PI / 180);

			if (ent.rotationAnchor)
				_graphs.translate(ent.rotationAnchor.x * -1, ent.rotationAnchor.y * -1);
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
};    
Menis.ResourceManager = function ()
{
	var self = this;

	Menis.Observable(self);

	var resources = Object.create(null);
	
	
	self.getImage = function (url, callback)
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

	self.loadImages = function (urls, callback, progressCallback)
	{
		var count = urls.length;

		for (var i = 0, l = count; i < l; i++)
		{
			self.getImage(urls[i], function ()
			{
				if (!--count && callback) callback();
			});
		}
	};
}    
Menis.SpritesheetAnimation = function (spritesheetSource, spriteWidth, spriteHeight)
{
	var _spritesheet = Menis.resourceManager.getImage(spritesheetSource);

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
(function ()
{
	function safelyAddProperty(obj, propertyName, value)
	{
		if (typeof obj[propertyName] == "undefined")
		{
			obj[propertyName] = value;
		}
	}

	/***********************
	Localization
	***********************/
	var Localization =
	{
		current: "br",

		getCurrent: function ()
		{
			return this.localizations[this.current];
		},

		localizations:
		{
			br:
			{
				months:
				[
					"janeiro",
					"fevereiro",
					"março",
					"abril",
					"maio",
					"junho",
					"julho",
					"agosto",
					"setembro",
					"outubro",
					"novembro",
					"dezembro"
				],

				weekdays:
				[
					"domingo",
					"segunda-feira",
					"terça-feira",
					"quarta-feira",
					"quinta-feira",
					"sexta-feira",
					"sábado"
				],

				currencySymbol: "R$",
				decimalSeparator: ",",
				thousandsSeparator: "."
			},

			en:
			{
				months:
				[
					"january",
					"february",
					"march",
					"april",
					"may",
					"june",
					"july",
					"august",
					"september",
					"october",
					"november",
					"december"
				],

				weekdays:
				[
					"sunday",
					"monday",
					"tuesday",
					"wednesday",
					"thursday",
					"friday",
					"saturnday"
				],

				currencySymbol: "US$",
				decimalSeparator: ".",
				thousandsSeparator: ","
			}
		}
	};

	/***********************
	String
	***********************/
	safelyAddProperty(String.prototype, "replaceAll", function (oldString, newString)
	{
		return this.split(oldString).join(newString);
	});

	safelyAddProperty(String.prototype, "trim", function (oldString, newString)
	{
		return this.replace(/^\s+|\s+$/g, '');
	});

	safelyAddProperty(String.prototype, "trimLeft", function (oldString, newString)
	{
		return this.replace(/^\s+/, '');
	});

	safelyAddProperty(String.prototype, "trimRight", function (oldString, newString)
	{
		return this.replace(/\s+$/, '');
	});

	safelyAddProperty(String.prototype, "padLeft", function (padString, length)
	{
		var str = this;

		while (str.length < length)
			str = padString + this;

		return str;
	});

	safelyAddProperty(String.prototype, "padRight", function (padString, length)
	{
		var str = this;

		while (str.length < length)
			str = this + padString;

		return str;
	});

	safelyAddProperty(String, "isNullOrWhitespace", function (str)
	{
		return Boolean(!str || !str.trim());
	});

	safelyAddProperty(String.prototype, "interpolate", function (data) //Aceita vários parâmetros
	{
		var result = this;

		//Caso mais de um parâmetro seja especificado, assume o mesmo comportamento do String.Format do .NET
		if (arguments.length > 1)
		{
			data = Array.prototype.slice.call(arguments, 0);
		}

		//Matches ${propertyName}
		result = this.replace(/\$\{([\s\S]*?)\}/gi, function (match, capture)
		{
			return data[capture];
		});

		//Matches $!{expression}
		result = result.replace(/\$\!\{([\s\S]*?)\}/gi, function (match, capture)
		{
			return eval(capture) || "";
		});

		return result;
	});

	//Adiciona um nome a mais para o método interpolate
	safelyAddProperty(String.prototype, "format", String.prototype.interpolate);

	safelyAddProperty(String.prototype, "insert", function (index, str)
	{
		return this.substr(0, index) + str + this.substr(index);
	});



	/***********************
	Date
	***********************/
	safelyAddProperty(Date.prototype, "getMonthName", function ()
	{
		return Localization.getCurrent().months[this.getMonth()];
	});

	safelyAddProperty(Date.prototype, "getAbbreviatedMonthName", function ()
	{
		return this.getMonthName().substr(0, 3);
	});

	safelyAddProperty(Date.prototype, "getWeekDayName", function ()
	{
		return Localization.getCurrent().weekdays[this.getDay()];
	});

	safelyAddProperty(Date.prototype, "getAmPm", function ()
	{
		return this.getHours() <= 12 ? "AM" : "PM";
	});

	safelyAddProperty(Date.prototype, "getHours12", function ()
	{
		var h = this.getHours();

		return h <= 12 ? h : h - 12;
	});

	safelyAddProperty(Date.prototype, "getTwoDigitYear", function ()
	{
		var year = this.getYear();

		return year - ~~(year / 100) * 100;
	});

	safelyAddProperty(Date.prototype, "getMilleniumYear", function ()
	{
		var year = this.getFullYear();

		return ~~(year / 1000) * 1000;
	});

	safelyAddProperty(Date.prototype, "format", function (strFormat)
	{
		//Nota: não sei por que, mas dar um return direto com o código abaixo faz a função retornar undefined.
		//Tive que armazenar o resultado numa variável antes (result).

		var result =
			strFormat
			.replaceAll("yyyy", this.getFullYear().toString().padLeft("0", 4))
			.replaceAll("YYYY", this.getFullYear().toString().padLeft("0", 4))
			.replaceAll("yy", this.getTwoDigitYear().toString().padLeft("0", 2))
			.replaceAll("YY", this.getTwoDigitYear().toString().padLeft("0", 2))
			.replaceAll("MMMM", this.getMonthName())
			.replaceAll("MMM", this.getAbbreviatedMonthName())
			.replaceAll("MM", (this.getMonth() + 1).toString().padLeft("0", 2))
			.replaceAll("dddd", this.getWeekDayName())
			.replaceAll("DDDD", this.getWeekDayName())
			.replaceAll("ddd", this.getWeekDayName().substr(0, 3))
			.replaceAll("DDD", this.getWeekDayName().substr(0, 3))
			.replaceAll("dd", this.getDate().toString().padLeft("0", 2))
			.replaceAll("DD", this.getDate().toString().padLeft("0", 2))
			.replaceAll("HH", this.getHours().toString().padLeft("0", 2))
			.replaceAll("hh", this.getHours12().toString().padLeft("0", 2))
			.replaceAll("mm", this.getMinutes().toString().padLeft("0", 2))
			.replaceAll("ss", this.getSeconds().toString().padLeft("0", 2))
			.replaceAll("SS", this.getSeconds().toString().padLeft("0", 2))
			.replaceAll("AP", this.getAmPm())
			.replaceAll("ap", this.getAmPm());

		return result;
	});

	safelyAddProperty(Date, "fromJsonDate", function (jsonDate)
	{
		return new Date(parseInt(jsonDate.substr(6), 10));
	});

	safelyAddProperty(Date, "parseFormat", function (dateString, format)
	{
		if (!dateString || !format)
		{
			return undefined;
		}

		//Obtem as diferentes partes da string de formato
		var formatParts = [];
		var partHolder = "";

		for (var i = 0; i < format.length; i++)
		{
			var c = format.charAt(i);

			//Caso o caractere atual seja diferente do último armazenado, isso significa que uma outra parte do formato começou
			if (partHolder && c != partHolder.charAt(partHolder.length - 1))
			{
				//Caso seja "AP" (formato para o indicador AM/PM), a letra pode ser diferente
				if (partHolder.toUpperCase() != "A" && c.toUpperCase() != "P")
				{
					formatParts.push(partHolder);
					partHolder = c;

					continue;
				}
			}

			partHolder += c;
		}

		formatParts.push(partHolder);


		var year = 0;
		var month = 0;
		var day = 0;
		var hours = 0;
		var minutes = 0;
		var seconds = 0;

		for (var i = 0; i < formatParts.length; i++)
		{
			var part = formatParts[i];

			//Caso a string não seja um placeholder ("dd", "MM", etc), apenas remove o separador da string de data
			if (!/\w+/.test(part))
				dateString = dateString.replace(part, "");

			switch (part)
			{
				case "yyyy":
				case "YYYY":
					year = parseInt(dateString.substr(0, 4), 10);
					dateString = dateString.substr(4);
					break;

				case "YY":
				case "yy":
					year = parseInt(dateString.substr(0, 2), 10);

					var now = new Date();
					var millenium = ~ ~(now.getFullYear() / 100) * 100;

					if (year > now.getTwoDigitYear())
						year += millenium - 100;
					else
						year += millenium;

					dateString = dateString.substr(3);
					break;

				case "MM":
					month = parseInt(dateString.substr(0, 2), 10);
					dateString = dateString.substr(2);
					break;

				case "dd":
				case "DD":
					day = parseInt(dateString.substr(0, 2), 10);
					dateString = dateString.substr(2);
					break;

				case "HH":
				case "hh":
					hours = parseInt(dateString.substr(0, 2), 10);
					dateString = dateString.substr(2);
					break;

				case "mm":
					minutes = parseInt(dateString.substr(0, 2), 10);
					dateString = dateString.substr(2);
					break;

				case "SS":
				case "ss":
					seconds = parseInt(dateString.substr(0, 2), 10);
					dateString = dateString.substr(2);
					break;

				case "AP":
				case "ap":
					var amPm = dateString.substr(0, 2);

					if (amPm.toUpperCase() == "PM")
						hours += 12;

					dateString = dateString.substr(2);
					break;
			}
		}

		return new Date(year, month - 1, day, hours, minutes, seconds, 0);
	});

	safelyAddProperty(Date, "today", function (jsonDate)
	{
		var now = new Date();

		return new Date(now.getFullYear(), now.getMonth(), now.getDate());
	});


	/***********************
	Number/Math
	***********************/
	safelyAddProperty(Number.prototype, "toNumberString", function (decimalDigits)
	{
		var loc = Localization.getCurrent();

		decimalDigits = decimalDigits || 0;

		var str = this.toFixed(decimalDigits); 											//Converte o número para uma string com a quantidade de dígitos especificada
		str = str.replace(".", loc.decimalSeparator); 									//Troca o ponto de número decimal (EUA) por vírgula (BR)
		str = str.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + loc.thousandsSeparator); 	//Adiciona pontos de milhar

		return str;
	});

	//Math.round com parâmetro para precisão
	(function ()
	{
		var roundFunc = Math.round;

		Math.round = function (number, precision)
		{
			if (precision === undefined)
			{
				return roundFunc(number);
			}
			else
			{
				return parseFloat(number.toFixed(precision));
			}
		};
	})();

	safelyAddProperty(Number.prototype, "round", function (precision)
	{
		return Math.round(this, precision || 0);
	});


	/***********************
	Array
	***********************/
	safelyAddProperty(Array.prototype, "removeFirst", function (value)
	{
		var index = this.indexOf(value);

		if (index >= 0)
		{
			this.splice(index, 1);
		}

		return this;
	});

	safelyAddProperty(Array.prototype, "removeLast", function (value)
	{
		var index = this.lastIndexOf(value);

		if (index >= 0)
		{
			this.splice(index, 1);
		}

		return this;
	});

	safelyAddProperty(Array.prototype, "removeAll", function (value)
	{
		var index = this.indexOf(value);

		while (index >= 0)
		{
			this.splice(index, 1);

			index = this.indexOf(value);
		}

		return this;
	});

	safelyAddProperty(Array.prototype, "map", function (func)
	{
		if (!func)
		{
			return this.slice();
		}

		var result = [];

		for (var i = 0; i < this.length; i++)
		{
			result.push(func(this[i]));
		}

		return result;
	});

	safelyAddProperty(Array.prototype, "filter", function (predicate)
	{
		if (!predicate)
		{
			return this.slice();
		}

		var results = [];

		for (var i = 0; i < this.length; i++)
		{
			if (predicate(this[i]))
				results.push(this[i]);
		}

		return results;
	});
	
	safelyAddProperty(Array.prototype, "clean", function ()
	{
		return this.filter(function (value) { return value !== null && value !== undefined; });
	});

	safelyAddProperty(Array.prototype, "some", function (predicate, thisObject)
	{
		if (!predicate)
		{
			return this.slice();
		}

		var results = [];

		for (var i = 0; i < this.length; i++)
		{
			if (predicate.call(thisObject, this[i]))
				return true;				
		}

		return false;
	});

	safelyAddProperty(Array.prototype, "sortBy", function (valueFunc)
	{
		if (!valueFunc)
		{
			return this.slice();
		}

		return this.sort(function (a, b)
		{
			var valueA = valueFunc(a);
			var valueB = valueFunc(b);

			if (valueA > valueB)
			{
				return 1;
			}
			else if (valueA == valueB)
			{
				return 0;
			}
			else
			{
				return -1;
			}
		});
	});

	safelyAddProperty(Array.prototype, "sortByDesc", function (valueFunc)
	{
		if (!valueFunc)
		{
			return this.slice();
		}

		return this.sort(function (a, b)
		{
			var valueA = valueFunc(a);
			var valueB = valueFunc(b);

			if (valueA > valueB)
			{
				return -1;
			}
			else if (valueA == valueB)
			{
				return 0;
			}
			else
			{
				return 1;
			}
		});
	});

	safelyAddProperty(Array.prototype, "sortDesc", function ()
	{
		return this.sort().reverse();
	});

	safelyAddProperty(Array.prototype, "distinct", function ()
	{
		var results = [];

		for (var i = 0; i < this.length; i++)
		{
			if (results.indexOf(this[i]) < 0)
				results.push(this[i]);
		}

		return results;
	});

	safelyAddProperty(Array.prototype, "toStringArray", function ()
	{
		return this.map(
			function (i)
			{
				return (i !== null && i !== undefined) ? i.toString() : i;
			}
		);
	});

	safelyAddProperty(Array.prototype, "reduce", function (func)
	{
		if (!func)
		{
			return undefined;
		}

		var result = this[0];

		for (var i = 1, len = this.length; i < len; i++)
			result = func(result, this[i]);

		return result;
	});

	safelyAddProperty(Array.prototype, "sum", function (selectorFunc)
	{
		if (this.length === 0) return 0;

		return this.reduce(function (total, item) { return total + item; });
	});

	safelyAddProperty(Array.prototype, "max", function ()
	{
		if (this.length === 0) return undefined;

		return this.reduce(function (total, item) { return total >= item ? total : item; });
	});

	safelyAddProperty(Array.prototype, "min", function ()
	{
		if (this.length === 0) return undefined;

		return this.reduce(function (total, item) { return total <= item ? total : item; });
	});

	safelyAddProperty(Array.prototype, "avg", function ()
	{
		if (this.length === 0) return 0;

		return this.sum() / this.length;
	});

	//TODO: Implementar método que aceite arrays com tamanhos diferentes
	safelyAddProperty(Array, "flatten", function (arrays, func)
	{
		if (!arrays || !func)
		{
			return undefined;
		}

		if (!arrays.length)
		{
			return [];
		}

		var results = [];

		var maxLen = arrays.map(function (arr) { return arr.length; }).max();

		for (var item = 0; item < maxLen; item++)
		{
			var arr;
			var result;

			/*
			Obtem o valor inicial, percorrendo todos os arrays e verificando se a posição atual está dentro do tamanho de cada um.
			Caso esteja, o valor inicial é o item na posição atual do array na posição arr.
			*/
			for (arr = 0; arr < arrays.length; arr++)
			{
				if (item < arrays[arr].length)
				{
					result = arrays[arr][item];
					break;
				}
			}

			++arr;

			//Executa a função de agregação e armazena os resultados
			for (; arr < arrays.length; arr++) //Inicia o loop à partir do array logo após o array anterior, que já foi agregado (++arr)
			{
				if (item >= arrays[arr].length)
					break;

				result = func(result, arrays[arr][item]);
			}

			results[item] = result;
		}

		return results;
	});

	safelyAddProperty(Array, "sum", function (arrays)
	{
		return Array.flatten(arrays, function (total, item) { return total + item; });
	});

	/***********************
	window.location
	***********************/
	safelyAddProperty(window.location, "getParts", function ()
	{
		var root = "${0}//${1}${2}".interpolate([location.protocol, location.hostname, (location.port ? ":" + location.port : "")]);

		var pathname = this.pathname;

		if (pathname.indexOf("/") === 0)
			pathname = pathname.substr(1);

		var path = pathname.split("/");

		return [root].concat(path);
	});

	safelyAddProperty(window.location, "root", function (deepness)
	{
		return this.getParts().slice(0, 1 + (deepness || 0)).join("/");
	});

	safelyAddProperty(window.location, "map", function (relativeUrl, rootDeepness)
	{
		return relativeUrl.replaceAll("~", this.root(rootDeepness));
	});
})();
    
global.Menis = Menis;

})(window);    
(function (global) {    
Menis.UI = Menis.UI || {};
Menis.UI.ScrollPanel = Menis.Entity.specialize(function (text)
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
global.Menis = Menis;

})(window);