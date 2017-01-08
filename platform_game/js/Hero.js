var Hero = function () {
	var self = Object.create(GameObject);

	game.objects.push(self);

	self.powers = [];

	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;
	self.canMove = true;
	self.canJump = true;
	self.canChangeAnimation = true;

	self.x = 0;
	self.y = 0;
	self.width = 45;
	self.height = 72;
	self.xAccel = 0;
	self.yAccel = 0;

	self.state = new BaseHeroState(self);

	self.graphs = new Menis.Entity('hero');

	self.processFrame = function ()
	{
		for (var i = 0, l = self.powers.length; i < l; i++)
		{
			if (self.powers[i].execute(self)) break;
		}

		self.state.processBeforeCollision();

		self.x += self.xAccel;
		self.y += self.yAccel;

		var groundY = null;

		//Verifica se o herói está colidindo com o cenário
		if (self.y + self.height >= Menis.root.height) {
			groundY = Menis.root.height;
			stopJumping();
		}
		else
		{
			//Verifica se está colidindo com alguma plataforma
			for (var i = 0; i < Menis.root.plataforms.length; i++) {
				var p = Menis.root.plataforms[i];

				var nextMove = {
					left:   self.x + self.xAccel,
					top:    self.y + self.yAccel,
					right:  self.x + self.xAccel + self.width,
					bottom: self.y + self.yAccel + self.height
				};

				if (Menis.Collisions.rectanglesOverlapsX(nextMove, p.getRectangle())) {
					if (self.y + self.height <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p.getRectangle())) {
						groundY = p.y;
						stopJumping();
						break;
					}
				}
			}

			if (groundY === null) //If we don't have a plataform to stand, then we are jumping/falling
				self.jumping = true;
		}

		if (self.x < 0)
		{
			self.x = 0;
			self.xAccel = 0;
		}
		else if (self.x + self.width > Menis.root.width)
		{
			self.x = Menis.root.width - self.width - 1;
			self.xAccel = 0;
		}


		//Direction and speed control
		if (self.xAccel > 0)
		{
			self.direction = "right";
			self.xAccel = Math.max(self.xAccel - (!self.firing ? 1 : self.jumping ? 1 : 5), 0);
		}
		else if (self.xAccel < 0)
		{
			self.direction = "left";
			self.xAccel = Math.min(self.xAccel + (!self.firing ? 1 : self.jumping ? 1 : 5), 0);
		}

		if (self.jumping)
		{			
			self.yAccel += 2; //Gravity

			if (Math.abs(self.yAccel) > 100)
				self.yAccel = self.yAccel < 0 ? -100 : 100;
		}

		if (groundY !== null) self.y = groundY - self.height;

		self.state.processAfterCollision();

		self.getAnimation().flipHorizontally = self.direction === "left"; //If facing left, flip

		self.graphs.x = self.x;
		self.graphs.y = self.y;
	};

	self.getAnimation = self.graphs.getAnimation.bind(self.graphs);
	self.setAnimation = self.graphs.setAnimation.bind(self.graphs);

	self.hitTest = function (other) {
		return Menis.Collisions.rectanglesOverlaps(
			self.getRectangle(),
			other.getRectangle()
		);
	};

	self.getRectangle = function () {
		return {
			left: self.x,
			top: self.y,
			right: self.x + self.width,
			bottom: self.y + self.height
		};
	};

	function stopJumping()
	{
		self.yAccel = 0;
		self.jumping = false;
	}

	self.graphs.scale(1.5, 1.5);

	self.powers.push(hadouken());
	self.powers.push(shoryuken());

	return self;
};