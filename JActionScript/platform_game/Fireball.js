Fireball = Menis.Entity.specialize(function (origin)
{
	var self = this;
	var right = origin.direction == "right";

	function initialize()
	{
		self.x = origin.x + (right ? origin.width : -origin.width);
		self.y = origin.y + origin.height / 2 - 20;
		
		var animationSufix = (origin.direction == "right" ? "" : "_flipped") + ".png";
		
		self.animation = new Menis.SpritesheetAnimation("platform_game/img/hadouken" + animationSufix, 42, 40);
		
		self.explodeAnimation = new Menis.SpritesheetAnimation("platform_game/img/power_explode" + animationSufix, 42, 40);
		self.explodeAnimation.actions[2] = function()
		{
			self.destroy();
		};
	}
	
	self.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (self.exploded) return;

		for (var i = 0; i < Menis.root.enemies.length; i++)
		{
			var obs = Menis.root.enemies[i];
			if (self.hitTest(obs))
			{
				obs.hit = true;
				self.explode();
				return;
			}
		}

		if (self.x <= 0)
		{
			self.x = 0;
			self.explode();
			return;
		}
		else if (self.x + self.width >= Menis.root.width)
		{
			self.x = Menis.root.width - self.width;
			self.explode();
			return;
		}

		self.x += right ? 25 : -25;
	});
	
	initialize();
});

Fireball.prototype.explode = function ()
{
	this.animation = this.explodeAnimation;
	this.frameDelay = 1;
	this.exploded = true;
};