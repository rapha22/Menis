Menis.Game.Fireball = Menis.Entity.specialize(function (origin, power)
{
	var self = this;
	var right = origin.direction == "right";
	var speed = 25;

	this.compositeOperation = "lighter";

	power = ~~(power / 20);

	function initialize()
	{
		self.setAnimation(new Menis.SpritesheetAnimation("img/hadouken.png", 42, 40));

		self.getAnimation().flipHorizontally = (origin.direction === "left");
		
		self.explodeAnimation = new Menis.SpritesheetAnimation("img/power_explode.png", 42, 40);
		self.explodeAnimation.flipHorizontally = (origin.direction === "left");
		self.explodeAnimation.actions[2] = function()
		{
			self.remove();
		};

		self.scale(Math.max(1, power), Math.max(1, power));

		self.x = origin.x + (right ? origin.width - speed: -self.width + speed);
		self.y = origin.y + origin.height / 2 - self.height / 2;
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

				if (--power <= 0)
				{
					self.explode();
					return;
				}
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

		self.x += right ? speed : -speed;
	});
	
	initialize();
});

Menis.Game.Fireball.prototype.explode = function ()
{
	this.setAnimation(this.explodeAnimation);
	this.frameDelay = 1;
	this.exploded = true;
};