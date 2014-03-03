function Animator(containerElement)
{
	if (window.$root) return null;
	
	DisplayObject.call(this, "$root");

	this.initialize(containerElement);
	
	var $this = this;
	
	this.objects = [];
	this.framesPerSecond = 30;
	this._intervalId = undefined;
	
	window.$root = this;
	window.$graphs = containerElement.getContext("2d");

	//Animation ---------------------------------------------------------------------------------------
	function animate()
	{	window.$graphs.clearRect(0, 0, $this.width, $this.height);
		
		if ($this.onEnterFrame)
			$this.onEnterFrame();
		
		for (var i = 0; i < $root.children.length; i++)
		{
			$graphs.save();
		
			var child = $root.children[i];
			
			//Sets the child's alpha
			if (child.alpha != null && child.alpha != undefined)
				window.$graphs.globalAlpha = child.alpha;
			
			//Sets the child's composite operation
			if (child.compositeOperation)
				window.$graphs.globalCompositeOperation = child.compositeOperation;
				
			$root.children[i].animate();
			
			resetRendering();
		}
	}
	
	function resetRendering()
	{
		$graphs.globalAlpha = 1;
		$graphs.globalCompositeOperation = "source-over";
		$graphs.fillStyle = "rgba(0, 0, 0, 1)";
		$graphs.strokeStyle = "rgba(0, 0, 0, 1)";
		
		$graphs.restore();
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
	
	//Key event handling ------------------------------------------------------------------------------
	
	window.$key = new Key(window.document);
	
	
	function propagateKeyEvent(object, functionName)
	{
		if (object != $this && object[functionName])
			object[functionName]();
		
		for(var i = 0; i < object.children.length; i++)
			propagateKeyEvent(object.children[i], functionName);
	}

	
	var oldKeyDown = containerElement.onkeydown;
	this.onKeyDown = function(event)
	{
		if (oldKeyDown)
			if (oldKeyDown(event) === false)
				return;

		propagateKeyEvent($root, "onKeyDown");
	}
	$key.addEventListener(this, "onKeyDown");

	
	var oldKeyUp = containerElement.onkeyup;
	this.onKeyUp = function(event)
	{
		if (oldKeyUp)
			if (!oldKeyUp(event) === false)
				return;
				
		propagateKeyEvent($root, "onKeyUp");
	}
	$key.addEventListener(this, "onKeyUp");
}