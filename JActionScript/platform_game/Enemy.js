Enemy = Menis.Entity.specialize(function ()
{
	var self = this;

	self.x = Menis.root.width + 10;
	self.y = Math.round(Math.min(Math.random() * Menis.root.height, Menis.root.height - 100));
	
	self.animation = Menis.Reflection.create(
		Menis.SpritesheetAnimation, "platform_game/img/enemy_flipped.png", 100, 100,
		{
			style: Menis.AnimationStyles.YOYO,
			frameDelay: 1
		}
	);
	
	self.animation.frameDelay = 1;
	
	var speed = 1 + Math.round(Math.random() * 7);
	
	self.addEventHandler(Menis.Events.ENTER_FRAME, function ()
	{
		if (self.hit)
		{
			if (self.x + self.width > 0)
			{
				var particlesSpacing = 5;

				for (var y = 0; y < self.height; y += particlesSpacing)
					for (var x = 0; x < self.width; x += particlesSpacing)
						createParticle(self, x, y);
			}

			self.destroy();

			Menis.root.enemies.splice(Menis.root.enemies.indexOf(self), 1);

			return;
		}

		self.x -= speed;

		if (self.x + self.width < 0)
		{
			self.hit = true;
			$game.sandBar.current++;
		}
	});
	
	function createParticle(origin, x, y)
	{
		var p = new Menis.Entity();
		
		p.animation = new Menis.CodeAnimation(function(g, e)
		{		
			g.fillStyle = "rgb(174, 151, 79)";
			g.fillRect(0, 0, e.width, e.height);
		});
		
		p.x 		= origin.x + x;
		p.y 		= origin.y + y;
		p.width 	= 1 + (Math.random() > 0.5 ? 1 : 0);
		p.height 	= p.width;
		
		p.xaccell 	= Math.random() * (Math.random() < 0.5 ? -1 : 1) * 25;
		p.yaccell 	= -5 - (Math.random() * 15);
		p.ySpeed 	= 1 + Math.random();
		
		p.addEventHandler(Menis.Events.ENTER_FRAME, function ()
		{	
			this.x += Math.round(this.xaccell);
			this.xaccell *= 0.94;

			this.y += Math.round(this.yaccell);
			this.yaccell += this.ySpeed;

			if (this.y > Menis.root.height || this.x < 0 || this.x > Menis.root.width)
				this.destroy();
		});
		
		Menis.root.addChild(p);
	}
});