Enemy = Menis.Entity.specialize(function ()
{
	var self = this;

	self.x = Menis.root.getWidth() + 10;
	self.y = Math.round(Math.min(Math.random() * Menis.root.getHeight(), Menis.root.getHeight() - 100));
	
	self.setAnimation(
		Menis.Reflection.create(
			Menis.SpritesheetAnimation,
			"platform_game/img/enemy_flipped.png",
			100,
			100,
			{
				style: Menis.AnimationStyles.YOYO,
				frameDelay: 1
			}
		)
	);
	
	var speed = 1 + Math.round(Math.random() * 7);
	
	self.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (self.hit)
		{
			if (self.x + self.getWidth() > 0)
			{
				var particlesSpacing = 5;

				for (var y = 0; y < self.getHeight(); y += particlesSpacing)
					for (var x = 0; x < self.getWidth(); x += particlesSpacing)
						createParticle(self, x, y);
			}

			self.destroy();

			Menis.root.enemies.splice(Menis.root.enemies.indexOf(self), 1);

			return;
		}

		self.x -= speed;

		if (self.x + self.getWidth() < 0)
		{
			self.hit = true;
			$game.sandBar.current++;
		}
	});
	
	function createParticle(origin, x, y)
	{
		var p = new Menis.Entity();
		
		p.setAnimation(new Menis.CodeAnimation(function(g, e)
		{		
			g.fillStyle = "rgb(174, 151, 79)";
			g.fillRect(0, 0, e.getWidth(), e.getHeight());
		}));
		
		p.x = origin.x + x;
		p.y = origin.y + y;

		p.setWidth(1 + (Math.random() > 0.5 ? 1 : 0));
		p.setHeight(p.getWidth());
		
		p.xaccell 	= Math.random() * (Math.random() < 0.5 ? -1 : 1) * 25;
		p.yaccell 	= -5 - (Math.random() * 15);
		p.ySpeed 	= 1 + Math.random();
		
		p.addEventHandler(Menis.Events.ENTER_FRAME, function ()
		{	
			this.x += Math.round(this.xaccell);
			this.xaccell *= 0.94;

			this.y += Math.round(this.yaccell);
			this.yaccell += this.ySpeed;

			if (this.y > Menis.root.getHeight() || this.x < 0 || this.x > Menis.root.getWidth())
				this.destroy();
		});
		
		Menis.root.addChild(p);
	}
});