var Util =
{
	getEvent: function(event)
	{
		return window.event || event;
	}
};

function Key(containerElement)
{
	var $this = this;
	this.eventListeners = [];

	this.LEFT = 37;
	this.UP = 38;
	this.RIGHT = 39;
	this.DONW = 40;
	this.SPACE = 32;
	this.BACKSPACE = 8;
	this.TAB = 9;
	this.ENTER = 13;
	this.SHIFT = 16;
	this.CTRL = 17;
	this.ALT = 18;
	this.PAUSE_BREAK = 19;
	this.CAPS_LOCK = 20;
	this.ESC = 27;
	this.PAGE_UP = 33;
	this.PAGE_DOWN = 34;
	this.END = 35;
	this.HOME = 36;
	this.INSERT = 45;
	this.DELETE = 46;
	this.WINDOWS_LEFT = 91;
	this.WINDOWS_RIGH = 92;
	this.NUMPAD_0 = 96;
	this.NUMPAD_1 = 97;
	this.NUMPAD_2 = 98;
	this.NUMPAD_3 = 99;
	this.NUMPAD_4 = 100;
	this.NUMPAD_5 = 101;
	this.NUMPAD_6 = 102;
	this.NUMPAD_7 = 103;
	this.NUMPAD_8 = 104;
	this.NUMPAD_9 = 105;
	this.MULTIPLY = 106;
	this.PLUS = 107;
	this.MINUS = 109;
	this.DIVIDE = 111;
	this.F1 = 112;
	this.F2 = 113;
	this.F3 = 114;
	this.F4 = 115;
	this.F5 = 116;
	this.F6 = 117;
	this.F7 = 118;
	this.F8 = 119;
	this.F9 = 120;
	this.F10 = 121;
	this.F11 = 122;
	this.F12 = 123;
	
	this.pressingKeys = [];

	this.isDown = function(keyCode)
	{
		for (var i = 0; i < this.pressingKeys.length; i++)
			if (this.pressingKeys[i] == keyCode)
				return true;

		return false;
	}
	
	function insertKey(key)
	{
		for (var i = 0; i < $this.pressingKeys.length; i++)
			if ($this.pressingKeys[i] == key)
				return;
			
		$this.pressingKeys.push(key);
	}

	var oldKeyDown = containerElement.onkeydown;
	containerElement.onkeydown = function(event)
	{
		insertKey(Util.getEvent(event).keyCode);
		$this.propagateKeyEvent("onKeyDown", event);
	}
	

	var oldKeyUp = containerElement.onkeyup;
	containerElement.onkeyup = function(event)
	{
		var key = Util.getEvent(event).keyCode;

		for (var i = 0; i < $this.pressingKeys.length; i++)
			if ($this.pressingKeys[i] == key)
			{
				$this.pressingKeys.splice(i, 1);
				break;
			}
			
		$this.propagateKeyEvent("onKeyUp", event);
	}
	
	this.addEventListener = function(listener, event)
	{
		this.eventListeners.push({ listener: listener, event: event });
	}
	
	this.removeEventListener = function(listener, event)
	{
		for(var i = 0; i < this.eventListeners.length; i++)
		{
			if (this.eventListeners[i].listener == listener && this.eventListeners[i].event == event)
				this.eventListeners.slice(i, 1);
		}
	}
	
	this.propagateKeyEvent = function(eventName, event)
	{
		for(var i = 0; i < this.eventListeners.length; i++)
			if (this.eventListeners[i].event == eventName)
				if (this.eventListeners[i].listener && this.eventListeners[i].listener[eventName])
					this.eventListeners[i].listener[eventName](event);
				
	}
};