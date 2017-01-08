var HadoukenState = function (hero) {
	var active = false;
	var powerCharging = false;
	var firing = false;
	var power = 0;
	var powerParticles = [];

	var animations = {
		charging: Menis.sprite("img_new/power_charge.png", 36, 47, null, { 1: function () { this.stop(); } }),
		firing: Menis.sprite("img_new/power_fire.png", 36, 47, null, {
			1: function () { Fireball(hero, power); },
			3: function () { reset(); }
		})
	};

	this.shouldApply = function () {
		if (active) return true;
		if (hero.jumping) return false;
		if (Menis.key.isDown('S')) return true;
		return false;
	};

	this.processBeforeCollision = function () {
		active = true;
		if (Menis.key.isDown('S') && !firing) {
			charge(hero);
		}
		else {
			fire(hero);
		}
	};

	this.setAnimation = function () {
		hero.setAnimation(powerCharging ? animations.charging : animations.firing, true);
	};

	this.getFriction = function () {
		return 3;
	};

	function charge(hero) {
		powerCharging = true;
		power = Math.min(10, power += 0.05);
		createPowerParticles(hero);
	}

	function fire(hero) {
		powerCharging = false;
		firing = true;

		for (var i = 0, l = powerParticles.length; i < l; i++)
			powerParticles[i].destroy();

		powerParticles = [];
	}

	function reset(hero) {
		active = false;
		powerCharging = false;
		firing = false;
		power = 0;
	}

	function createPowerParticles(hero) {
		var maxDist = 100;

		var xPosition = hero.direction == "right" ? 15 : 30;

		var destinationPoint = { x: hero.x + xPosition, y: hero.y + 45 };

		var maxParticles = (power * 25) / 4;

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

			powerParticles.push(p);

			$game.layers.front.addChild(p);
		}
	}
};