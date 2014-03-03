function DisplayObject(id, element)
{
	var self = this;

	self.children = [];
	self.parent   = null;
	
	//Dimensões
	self.x      = 0;
	self.y      = 0;
	self.width  = 0;
	self.height = 0;
	self.alpha  = 1;
	
	//Animação
	var _animation        = null;
	self.frameDelay       = 0;
	self.frameIndex       = 0;
	self._frameDelayAux   = 0;
	self.isAnimating      = true;
	self.reverseAnimation = false;
	self.reverseImage     = false;

	//Eventos
	self.onEnterFrame = null;
	self.onKeyDown    = null;
	self.onKeyUp      = null;
	self.onRemove     = null;
	self.onAdd        = null;
	
	
	//Inicialização -----------------------------------------------------------------
	
	self.initialize = function(el)
	{
		if (el)
		{
			self.element = el;
			self.width = el.width;			
			self.height = el.height;
		}		
	};
	
	self.initialize(element);
	
	
	//Animação ----------------------------------------------------------------------
	
	self.setAnimation = function(animation)
	{
		var animating = self.isAnimating;
		
		self.isAnimating = false;
	
		if (animation != self._animation)
		{		
			self._animation = animation;
			self.frameIndex = 0;
		}
		
		self.isAnimating = true;
	};
	
	self.getFramesCount = function()
	{
		if (!self._animation) return 0;
		
		return self._animation.getFramesCount();
	};
	
	function animateFrames()
	{
		if (!self._animation) return;
	
		var animation = self._animation;
		
		var frameAction = animation.drawFrame(self);
		
		if (!self.isAnimating) return;
			
		if (self._frameDelayAux < self.frameDelay)
		{
			self._frameDelayAux++;
			return;
		}

		self._frameDelayAux = 0;
		
		if (!self.reverseAnimation)
		{
			self.frameIndex++;
			self.frameIndex = self.frameIndex % animation.getFramesCount();
		}
		else
		{
			self.frameIndex--;
			
			if (self.frameIndex < 0) 
				self.frameIndex = animation.getFramesCount() - 1;
		}

		if (frameAction)
			frameAction.call(self);
	};
	
	function animateObject()
	{
		if (self.onEnterFrame)
			self.onEnterFrame();

		animateFrames();
				
		for (var i = 0; i < self.children.length; i++)
			self.children[i].animate();
	}
	
	self.animate = function()
	{
		animateObject();
	}
	
	self.getAbsoluteX = function()
	{
		var target = self;
		var absoluteX = 0;
		
		do
		{
			absoluteX += target.x;
		}
		while(target = target.parent);
		
		return absoluteX;
	}

	self.getAbsoluteY = function()
	{
		var target = self;
		var absoluteY = 0;
		
		do
		{
			absoluteY += target.y;
		}
		while(target = target.parent);
		
		return absoluteY;
	}
	
	
	//Funções de relação parent/child ------------------------------------------------------------
	
	self.addChild = function(child)
	{
		if (self.children[child.id])
			throw new Error("A child with the ID '" + child.id + "' already exists");

		if (!child.id)
			child.id = "child_" + new Date().getTime() + self.children.length;

		self.children.push(child);
		self.children[child.id] = child;

		child.parent = self;
		
		if (child.onAdd)
			child.onAdd();
	}

	self.removeChild = function(childId)
	{
		if (typeof(childId) != "string")
			childId = childId.id;
			
		var removedChild = null;

		for (var i = 0; i < self.children.length; i++)
		{
			if (self.children[i].id != childId) continue;

			removedChild = self.children[i];
			
			for(var j = 0; j < removedChild.children.length; j++)
				removedChild.children[j].destroy();
			
			self.children.splice(i, 1);
			break;
		}
		
		if (removedChild.onRemove)
			removedChild.onRemove();

		delete self.children[childId];
	}

	self.destroy = function()
	{
		self.parent.removeChild(self.id);
	}
	
	self.clearChildren = function()
	{
		for(var i = 0; i < self.children.length; i++)
			self.removeChild(self.children[i].id);
	}
	
	//Funções de relação parent/child ------------------------------------------------------------
	self.hitTest = function(other)
	{
		return Collisions.rectanglesOverlaps(self, other);		
	};
}