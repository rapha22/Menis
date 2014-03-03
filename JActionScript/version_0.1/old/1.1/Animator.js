function Animator(containerElement)
{
	var $this = this;
	
	this.objects = [];
	this.framesPerSecond = 30;
	this._intervalId = undefined;
	
	window.$root = new DisplayObject("$root");
	containerElement.appendChild(window.$root.element);

	function animate()
	{
		for (var i = 0; i < $root.children.length; i++)
			$root.children[i].animate();
	}
	
	this.start = function()
	{
		var updateRate = Math.floor(1000 / $this.framesPerSecond);
		$this._intervalId = setInterval(animate, updateRate);
	}

	this.stop = function()
	{
		clearInterval($this._intervalId);
		$this._intervalId = undefined;
	}
	
	function propagateKeyEvent(object, functionName)
	{
		if (object[functionName])
			object[functionName]();
		
		for(var i = 0; i < object.children.length; i++)
			propagateKeyEvent(object.children[i], functionName);
	}

	var oldKeyDown = containerElement.onkeydown;
	containerElement.onkeydown = function(event)
	{
		if (oldKeyDown)
			if (oldKeyDown(event) === false)
				return;

		propagateKeyEvent($root, "onKeyDown");
	}

	var oldKeyUp = containerElement.onkeyup;
	containerElement.onkeyup = function(event)
	{
		if (oldKeyUp)
			if (!oldKeyUp(event) === false)
				return;
				
		propagateKeyEvent($root, "onKeyUp");
	}

	var oldKeyPress = containerElement.onkeypress;
	containerElement.onkeypress = function(event) 
	{
		if (oldKeyPress)
			if (!oldKeyPress(event) === false)
				return;
				
		propagateKeyEvent($root, "onKeyPress");
	}

	window.$key = new Key(containerElement);
}