var FireballProto = function () {
	var self = Object.create(GameObject);
	
	var speed = 25;

	self.baseWidth = 42;
	self.baseHeight = 40;
	
	self.processFrame = function () {
		if (this.exploded) return;

		for (var i = 0; i < Menis.root.enemies.length; i++) {
			var enemy = Menis.root.enemies[i];
			if (this.hitTest(enemy)) {
				enemy.hit = true;
				this.createHit(enemy);
				if (--this.power <= 0) {
					this.explode();
					return;
				}
			}
		}

		if (this.x <= 0)
		{
			this.x = 0;
			this.explode();
			return;
		}
		else if (this.x + this.width >= Menis.root.width)
		{
			this.x = Menis.root.width - this.width;
			this.explode();
			return;
		}

		this.x += this.right ? speed : -speed;
		this.setupSize();

		this.syncAnimation();
	};

	self.setupSize = function () {
		this.width = ~~(this.baseWidth * Math.max(1, this.power / 1.5));
		this.height = ~~(this.baseHeight * Math.max(1, this.power / 1.5));
		this.y = this.pathY - (this.height / 2);
	};

	self.explode = function () {
		this.exploded = true;
		this.graph.setAnimation(this.explodeAnimation, true).frameDelay = 1;
	};

	self.syncAnimation = function () {
		this.graph.x = this.x;
		this.graph.y = this.y;
		var scale = Math.max(1, this.power / 1.5);
		this.graph.scale(scale, scale);
		this.graph.getAnimation().flipHorizontally = !this.right;
	};

	self.createHit = function (enemy) {
		var hit = new Menis.Entity();
		hit.scale(3.5, 3.5);
		hit.compositeOperation = "lighter";
		hit.setAnimation(Menis.sprite('img_new/hit.png', 27, 25, null, { 4: function () { hit.destroy(); } }));
		var rect = Menis.Collisions.getOverlappingRectangle(this.getRectangle(), enemy.getRectangle());
		hit.x = rect.left + ((rect.right - rect.left) / 2) - hit.width / 2;
		hit.y = rect.top + ((rect.bottom - rect.top) / 2) - hit.height / 2;
		game.layers.front.addChild(hit);
	};

	return self;
}();

var Fireball = function (origin, power) {
	var self = Object.create(FireballProto);
	
	game.objects.add(self);
	
	self.right = origin.direction == "right";
	self.power = ~~power + 1;
	self.pathY = origin.y + origin.height / 2;
	self.x = self.right ? origin.x + origin.width : origin.x;
	
	self.setupSize();

	self.graph = new Menis.Entity();
	self.graph.compositeOperation = "lighter";
	
	self.graph.setAnimation(Menis.sprite("img/hadouken.png", 42, 40));

	self.explodeAnimation = Menis.sprite("img/power_explode.png", 42, 40,
		{ flipHorizontally: !self.right },
		{ 2: function () { self.destroy(); } }
	);

	self.syncAnimation();

	game.layers.front.addChild(self.graph);

	return self;
};