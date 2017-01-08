var ShoryukenState = function (hero) {
	var active = false;
	var hasRaised = false;
	var hasExecuted = false;

	var anim = Menis.sprite("img_new/shoryuken.png", 42, 60, null, {
		4: end
	});

	this.shouldApply = function () {
		if (!hero.jumping) hasExecuted = false;

		if (active) return true;
		if (hasExecuted) return false;
		if (hero.jumping && Menis.key.isDown('S')) return true;
		
		return false;
	};

	this.processBeforeCollision = function () {
		active = true;

		if (!hasRaised) {
			hero.yAccel = -20;
			hasRaised = true;
		}
		
		for (var i = 0; i < Menis.root.enemies.length; i++) {
			var en = Menis.root.enemies[i];
			if (hero.hitTest(en)) en.hit = true;
		}

		createFireParticles();
	};

	this.setAnimation = function () {
		hero.setAnimation(anim, true).frameDelay = 1;
	};

	this.getFriction = function () {
		return 3;
	};

	function end() {
		active = false;
		hasExecuted = true;
		hasRaised = false;
	}

	function createFireParticles() {
		for (var i = 0; i < 100; i++) {
			(function (i) {
				var p = new Menis.Entity();
				p.setAnimation(new Menis.CodeAnimation(function (g) {
					g.fillStyle = '#F80';
					g.fillRect(0, 0, i % 4, i % 4);
				}));
				p.enterframe(function () {
					this.y -= i % 3;
					this.alpha -= 0.1 - (i % 5) / 100;
					if (this.alpha <= 0) this.destroy();
				});

				p.x = (hero.x - 20) + ~~(Math.random() * (hero.width + 40));
				p.y = (hero.y - 20) + ~~(Math.random() * (hero.height + 40));
				p.compositeOperation = "lighter";

				Menis.root.addChild(p);
			})(i);
		}
	}
};