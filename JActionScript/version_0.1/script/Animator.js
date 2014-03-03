function Animator(containerElement, stageWidth, stageHeight)
{
	if (window.$root) return null;
	
	DisplayObject.call(this, "root");
	
	stageWidth = stageWidth || this.width;
	stageHeight = stageHeight || this.height;

	this.initialize(containerElement);
	
	var self = this;
	
	this.objects = [];
	this.framesPerSecond = 30;
	this._intervalId = undefined;
	
	var mainGraphs = containerElement.getContext("2d");
	
	var doubleBuffer = document.createElement("canvas");
	doubleBuffer.width = stageWidth || containerElement.width;
	doubleBuffer.height = stageHeight || containerElement.height;
	
	window.$root = this;
	window.$graphs = doubleBuffer.getContext("2d");
	
	

	//Animation ---------------------------------------------------------------------------------------
	function animate()
	{	
		window.$graphs.clearRect(0, 0, stageWidth, stageHeight);
		
		if (self.onEnterFrame)
			self.onEnterFrame();
		
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
		
		mainGraphs.clearRect(0, 0, stageWidth, stageHeight);
		
		self.draw(doubleBuffer, containerElement, mainGraphs)
	}
	
	self.draw = function (buffer, mainCanvas, mainGraphs)
	{
		mainGraphs.drawImage(buffer	, 0, 0);
	};
	
	function resetRendering()
	{
		$graphs.globalAlpha = 1;
		$graphs.globalCompositeOperation = "source-over";
		$graphs.fillStyle = "rgba(0, 0, 0, 1)";
		$graphs.strokeStyle = "rgba(0, 0, 0, 1)";
		$graphs.lineWidth = 1;
		
		$graphs.restore();
	}
	
	this.start = function()
	{
		var updateRate = Math.floor(1000 / self.framesPerSecond);
		self._intervalId = setInterval(animate, updateRate);
	}

	this.stop = function()
	{
		clearInterval(self._intervalId);
		self._intervalId = undefined;
	}
	
	//Key event handling ------------------------------------------------------------------------------
	
	window.$key = new Key(window.document);
	
	
	function propagateKeyEvent(object, functionName)
	{
		if (object != self && object[functionName])
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
};