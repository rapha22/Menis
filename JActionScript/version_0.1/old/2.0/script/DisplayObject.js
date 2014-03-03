function DisplayObject(id, element)
{
	var $this = this;

	this.children = [];
	this.parent = null;
	
	//Dimensões
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	
	//Animação
	var _animation = null;
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
	
	
	//Inicialização -----------------------------------------------------------------
	
	this.initialize = function(el)
	{
		if (el)
		{
			this.element = el;
			this.width = el.width;			
			this.height = el.height;
		}		
	}
	
	this.initialize(element);
	
	
	//Animação ----------------------------------------------------------------------
	
	this.setAnimation = function(animation)
	{
		var animating = this.isAnimating;
		
		this.isAnimating = false;
	
		if (animation != $this._animation)
		{		
			$this._animation = animation;
			$this.frameIndex = 0;
		}
		
		this.isAnimating = true;
	}
	
	this.getFramesCount = function()
	{
		if (!this._animation) return 0;
		
		return $this._animation.getFramesCount();
	}
	
	function animateFrames()
	{
		if (!$this._animation) return;
	
		var animation = $this._animation;
		
		var frameAction = animation.drawFrame($this);
		
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
			$this.frameIndex = $this.frameIndex % animation.getFramesCount();
		}
		else
		{
			$this.frameIndex--;
			
			if ($this.frameIndex < 0) 
				$this.frameIndex = animation.getFramesCount() - 1;
		}

		if (frameAction)
			frameAction.call($this);
	}
	
	function animateObject()
	{
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
			child.id = "child_" + new Date().getTime() + this.children.length;

		this.children.push(child);
		this.children[child.id] = child;

		child.parent = this;
	}

	this.removeChild = function(childId)
	{
		if (typeof(childId) != "string")
			childId = childId.id;
			
		var removedChild = null;

		for (var i = 0; i < this.children.length; i++)
		{
			if (this.children[i].id != childId) continue;

			removedChild = this.children[i];
			this.children.splice(i, 1);
			break;
		}

		delete this.children[childId];
	}

	this.destroy = function()
	{
		this.parent.removeChild(this.id);
	}
	
	//Funções de relação parent/child ------------------------------------------------------------
	this.hitTest = function(other)
	{
		return Collisions.rectanglesOverlaps(this, other);		
	}
}