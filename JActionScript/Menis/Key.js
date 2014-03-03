Menis.Key = function (canvas)
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
		return Boolean(_pressingKeys[keyCode]);
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
		insertKey(event.keyCode);

		self.trigger(Menis.Events.KEY_DOWN, { keyCode: event.keyCode });
	});	

	document.body.addEventListener("keyup", function (event)
	{
		removeKey(event.keyCode);

		self.trigger(Menis.Events.KEY_UP, { keyCode: event.keyCode });
	});
};