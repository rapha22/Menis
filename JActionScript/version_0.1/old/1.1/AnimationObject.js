function DisplayObject(id, element)
{
	var $this = this;

	this.id = id || "child_" + new Date().getTime();
	this.children = [];
	this.parent = null;
	
	//Dimensões
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	
	//Animação
	var _frames = [];
	this.frameDelay = 0;
	this.frameIndex = 0;
	this._frameDelayAux = 0;
	this.isAnimating = true;
	this.reverseAnimation = false;
	this.reverseImage = false;

	//Eventos
	this.onEnterFrame = null;
	this.onKeyDown = null;
	this.onKeyUp = null;
	
	
	//Inicialização do objeto ---------------------------------------------------------
	
	//Cria o elemento div que conterá as animações
	if (element)
		this.element = (typeof element == "string") ? document.getElementById(element) : element;
	else
		this.element = document.createElement("div");

	this.element.style.position = "absolute";
	this.element.style.backgroundRepeat = "no-repeat";
	
	
	//Cria o elemento IMG que conterá as imagens da animação
	var backgroundImageElement = document.createElement("img");
	this.element.image = backgroundImageElement;
	this.element.appendChild(backgroundImageElement);
	

	//Animação ----------------------------------------------------------------------
	
	this.setFrames = function(frames)
	{
		var animating = this.isAnimating;
		
		this.isAnimating = false;
	
		if (frames != $this._frames)
		{		
			$this._frames = frames;
			$this.frameIndex = 0;
		}
		
		this.isAnimating = true;
	}
	
	this.getFramesCount = function()
	{
		if (!this._frames) return 0
		
		return $this._frames.length;
	}
	
	function animateFrames()
	{		
		var picUrl;
		
		if (!$this._frames || $this._frames.length == 0) return;
		
		if (typeof($this._frames[$this.frameIndex]) == 'string')
			picUrl = $this._frames[$this.frameIndex];
		else
			picUrl = $this._frames[$this.frameIndex].image;		
		
		$this.element.image.src = picUrl;
		
		$this.width = $this.element.image.width;
		$this.height = $this.element.image.height;
		
		if ($this.reverseImage)
			$this.element.setAttribute("class", "reverse");
		else
			$this.element.setAttribute("class", "");
		
		if (!$this.isAnimating) return;
			
		if ($this._frameDelayAux < $this.frameDelay)
		{
			$this._frameDelayAux++;
			return;
		}

		$this._frameDelayAux = 0;
		
		if (!$this.reverseAnimation)
		{
			$this.frameIndex++;
			$this.frameIndex = $this.frameIndex % $this._frames.length;
		}
		else
		{
			$this.frameIndex--;
			if ($this.frameIndex < 0) $this.frameIndex = $this._frames.length - 1;
		}

		if (typeof($this._frames[$this.frameIndex]) != 'string')
			if ($this._frames[$this.frameIndex].action)
				$this._frames[$this.frameIndex].action.call($this);
	}
	
	function animateObject()
	{
		$this.element.style.left = $this.x + "px";
		$this.element.style.top = $this.y + "px";
		$this.element.style.width = $this.width + "px";
		$this.element.style.height = $this.height + "px";

		if ($this.onEnterFrame)
			$this.onEnterFrame();

		animateFrames();
				
		for (var i = 0; i < $this.children.length; i++)
			$this.children[i].animate();
	}
	
	this.animate = function()
	{
		animateObject();
	}

	
	//Funções de relação parent/child ------------------------------------------------------------
	
	this.addChild = function(child)
	{
		if (this.children[child.id])
			throw new Error("A child with the ID '" + child.id + "' already exists");

		if (!child.id)
			child.id = "child_" + this.children.length;

		this.children.push(child);
		this.children[child.id] = child;

		child.parent = this;

		this.element.style.zIndex = this.children.length;

		this.element.appendChild(child.element);
	}

	this.removeChild = function(childId)
	{
		var removedChild = null;

		for (var i = 0; i < this.children.length; i++)
		{
			if (this.children[i].id != childId) continue;

			removedChild = this.children[i];
			this.children.splice(i, 1);
			break;
		}

		this.element.removeChild(removedChild.element);
		delete this.children[childId];
	}

	this.destroy = function()
	{
		this.parent.removeChild(this.id);
	}	
}