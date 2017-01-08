var hadouken = function ()
{
	var powerCharging = false;
	var hadoukenPower = 0;

	var _powerParticles = [];

	var chargeAnim = Menis.sprite("img_new/power_charge.png", 36, 47, null, { 1: function () { this.stop(); } });
	var shotAnim = Menis.sprite("img_new/power_fire.png", 36, 47, null,
	{
		1: function (hero)
		{
			$game.layers.front.addChild(new Fireball(hero, hadoukenPower));
			hadoukenPower = 0;
		},
		2: function (hero) { reset(hero); }
	});

	function charge(hero)
	{
		if (!powerCharging)
		{
			powerCharging = true;
			hero.canChangeAnimation = false;
			hero.canMove = false;
			hero.canJump = false;
			hero.setAnimation(chargeAnim).flipHorizontally = hero.direction === "left";
		}
		
		hadoukenPower = Math.min(100, hadoukenPower + 1);
		createPowerParticles(hero);
	}

	function shot(hero)
	{
		powerCharging = false;
		hero.firing = true;
		hero.setAnimation(shotAnim).flipHorizontally = hero.direction === "left";

		for (var i = 0, l = _powerParticles.length; i < l; i++)
			_powerParticles[i].destroy();

		_powerParticles = [];
	}

	function reset(hero)
	{
		hero.firing = false;
		hero.canMove = true;
		hero.canJump = true;
		hero.canChangeAnimation = true;
	}

	function createPowerParticles(hero)
	{
		var maxDist = 100;

		var xPosition = hero.direction == "right" ? 15 : 30;

		var destinationPoint = { x: hero.x + xPosition, y: hero.y + 45 };

		var maxParticles = hadoukenPower / 4;

		for (var i = 0; i < maxParticles; i++)
		{
			var p = new Menis.Entity();

			p.divider = 3 + ~~(Math.random() * 7);

			var size = ~~(Math.random() * 3);

			p.setAnimation(new Menis.CodeAnimation(function (g)
			{
				g.fillStyle = "#10AAFF";
				g.fillRect(0, 0, size, size);
			}));

			p.enterframe(function ()
			{
				var xDist = ((destinationPoint.x - this.x) / this.divider * Math.random());
				var yDist = ((destinationPoint.y - this.y) / this.divider * Math.random());

				if (Math.abs(xDist) < 0.1 && Math.abs(yDist) < 0.1)
				{
					this.destroy();
				}

				this.x += xDist;
				this.y += yDist;
			});

			p.x = destinationPoint.x + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.y = destinationPoint.y + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.compositeOperation = "lighter";

			_powerParticles.push(p);

			$game.layers.front.addChild(p);
		}
	}


	return { 
		execute: function (hero)
		{
			if (!powerCharging && (hero.jumping || hero.firing)) return false;

			if (Menis.key.isDown('S'))
			{
				charge(hero);
			}
			else if (powerCharging)
			{
				shot(hero);
			}

			return true;
		}
	};
}