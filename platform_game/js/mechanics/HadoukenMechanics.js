Menis.Game.Resources.add(
	'img_new/power_charge.png',
	'img_new/power_fire.png'
);

Menis.Util.ns('Menis.Game.Mechanics').HadoukenMechanics = function HadoukenMechanics(target) {

	HadoukenMechanics.IDLE = 'idle';
	HadoukenMechanics.CHARGING = 'charging';
	HadoukenMechanics.SHOOTING = 'shooting';

	this.state = HadoukenMechanics.IDLE;
	this.power = 0;
	
	var ui = new HadoukenMechanicsUI();

	function charge() {
		this.state = HadoukenMechanics.CHARGING;		
		this.power = Math.min(100, this.power + 1);
	}

	function shot() {
		this.state = HadoukenMechanics.SHOOTING;
	}

	ui.on('shot', function () {
		new Menis.Game.Fireball(target, HadoukenMechanics);
        this.power = 0;
	})

	ui.on('ended', function () {
		this.state = HadoukenMechanics.IDLE;
	});

	var self = this;

	this.execute = function () {
		if (target.jumping) return false;

		if (Menis.key.isDown('S')) {
			charge();
			ui.update(this, target);
			return { exclusive: true };
		}
		else if (self.state === HadoukenMechanics.CHARGING) {
			shot();
			ui.update(this, target);
			return { exclusive: true };
		}
		else {
			return false;
		}
	};
}

function HadoukenMechanicsUI() {
	var _powerParticles = [];
	var self = this;

	Menis.Observable(self);

	var chargeAnim = new Menis.SpritesheetAnimation("img_new/power_charge.png", 36, 47, {
		actions: { 1: function () { self.trigger('charging'); }
	}});

	var shotAnim = new Menis.SpritesheetAnimation("img_new/power_fire.png", 36, 47, {
		actions: {
			1: function () { self.trigger('shot');  },
			2: function () { self.trigger('ended'); }
		}
	});

	self.update = function update(HadoukenMechanics, target) {
		switch (HadoukenMechanics.state){
			case HadoukenMechanics.IDLE:
				break;
			case HadoukenMechanics.CHARGING:
				charge(target.ui);
				break;
			case HadoukenMechanics.SHOOTING:
				shot(target.ui);
				break;
		}
	}

	function shot(ui) {
		ui.setAnimation(shotAnim);

		if (_powerParticles.length) { 
			_powerParticles.forEach(function (p) { p.remove(); });
			_powerParticles = [];
		}
	}

	function charge(target) {
		target.ui.setAnimation(chargeAnim);

		var maxDist      = 100;
		var xPosition    = target.direction == "right" ? 15 : 30;
		var destPoint    = { x: target.x + xPosition, y: target.y + 45 };
		var maxParticles = HadoukenMechanics.power / 4;

		for (var i = 0; i < maxParticles; i++) {
			
			var p = new Menis.Entity();

			p.size = ~~(Math.random() * 3);
			p.divider = 3 + ~~(Math.random() * 7);
			
			p.x = destPoint.x + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.y = destPoint.y + (Math.random() * maxDist) * (Math.random() < 0.5 ? -1 : 1);
			p.compositeOperation = "lighter";

			p.setAnimation(new Menis.CodeAnimation(function (g, p) {
				g.fillStyle = "#10AAFF";
				g.fillRect(0, 0, p.size, p.size);
			}));

			p.enterframe(function () {
				var xDist = ((destPoint.x - this.x) / this.divider * Math.random());
				var yDist = ((destPoint.y - this.y) / this.divider * Math.random());

				if (Math.abs(xDist) < 0.1 && Math.abs(yDist) < 0.1) {
					this.remove();
				}

				this.x += xDist;
				this.y += yDist;
			});

			_powerParticles.push(p);

			$game.layers.front.addChild(p);
		}
	}
}