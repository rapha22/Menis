(function ()
{
	if (!Menis) throw new TypeError("Menis is required");

	Menis.easy =
	{
		_fill: function (anim, inits, actions)
		{
			if (inits)
			{
				var initKeys = Object.getOwnPropertyNames(inits);

				for (var i = 0, l = initKeys.length; i < l; i++)
				{
					anim[initKeys[i]] = inits[initKeys[i]];
				}
			}

			if (actions)
			{
				var aKeys = Object.getOwnPropertyNames(actions);

				for (var i = 0, l = aKeys.length; i < l; i++)
				{
					anim.actions[aKeys[i]] = actions[aKeys[i]];
				}
			}
		},

		sprite: function (url, width, height, inits, actions)
		{
			var anim = new Menis.SpritesheetAnimation(url, width, height);
			this._fill(anim, inits, actions);
			return anim;
		},

		image: function (url, inits, actions)
		{
			var anim = new Menis.ImageAnimation(url);
			this._fill(anim, inits, actions);
			return anim;
		},

		on: function (target, evName, handler)
		{
			target.addEventHandler(evName, handler);
		},

		off: function (target, evName, handler)
		{
			target.removeEventHandler(evName, handler);
		},

		keyup:         function (handler) { this.on(Menis.key, Menis.Events.KEY_UP, handler); },
		keydown:       function (handler) { this.on(Menis.key, Menis.Events.KEY_DOWN, handler); },
		keydownalways: function (handler) { this.on(Menis.key, Menis.Events.KEY_DOWN_ALWAYS, handler); }
	};

	Menis.Entity.prototype.enterframe = function (handler)
	{
		this.on(Menis.Events.ENTER_FRAME, handler);
	}

	Menis.Entity.prototype.mouseup = function (handler)
	{
		this.on(Menis.Events.MOUSE_UP, handler);
	}

	Menis.Entity.prototype.mousedown = function (handler)
	{
		this.on(Menis.Events.MOUSE_DOWN, handler);
	}

	Menis.Entity.prototype.mousewheel = function (handler)
	{
		this.on(Menis.Events.MOUSE_WHEEL, handler);
	}

	Menis.Entity.prototype.mousemove = function (handler)
	{
		this.on(Menis.Events.MOUSE_MOVE, handler);
	}

})();