Menis.Game.Resources.add(
	'img_new/standing.png',
	'img_new/walking.png',
	'img_new/falling.png'
);

Menis.Game.Mechanics = Menis.Game.Mechanics || {};
Menis.Game.Mechanics.BasicMechanics = function BasicMechanics(target) {

	target.x = 0;
	target.y = 0;
	target.speed = 2;
	target.maxSpeed = 26;
	target.friction = 2;
	target.gravity = 2;
	target.jumpPower = 22;
	target.xAccel = 0;
	target.yAccel = 0;
	target.jumping = false;
	target.direction = 'right';

	var commands =
	BasicMechanics.commands = {
		moveLeft:         Menis.Game.Util.getNewId(),
		moveRight:        Menis.Game.Util.getNewId(),
		jump:             Menis.Game.Util.getNewId(),
		leapFromPlatform: Menis.Game.Util.getNewId()
	};

	addControllerTriggers();

	var ui = new Menis.Game.Mechanics.BasicMechanicsUI(target.ui);

	this.execute = function () {
		handleHorizontalMovement();
		enforceMaxSpeed();
		applyGravity();
		handlePlatforms();
		handlePlatformLeaping();
		handleJumping();
		enforceMaxYAccel();
		enforceStageBoundaries();
		updatePosition();

		ui.update(target);

		return { isExclusive: false };
	};

	function addControllerTriggers() {
		var keys = Menis.Game.keysBinding;
		var c = $game.controller;

		c.addFrameTrigger([keys.left], commands.moveLeft);
		c.addFrameTrigger([keys.right], commands.moveRight);
		c.addKeyDownTrigger([keys.jump], commands.jump);
		c.addKeyDownTrigger([keys.down, keys.jump], commands.jump);
	}

	function cmd(commandId) {
		return target.commands.indexOf(commandId) > -1;
	}

	function handleHorizontalMovement() {
		if (cmd(commands.moveRight)) {
			target.xAccel += target.speed * (target.xAccel < 0 ? 2 : 1);
		}
		else if (cmd(commands.moveLeft)) {
			target.xAccel -= target.speed * (target.xAccel > 0 ? 2 : 1);
		}
		else { 
			var sign = target.xAccel > 0 ? +1 : -1;
			var accel = Math.abs(target.xAccel) - target.friction;
			accel = Math.max(accel, 0) * sign;
			target.xAccel = accel;
		}

		if (target.xAccel > 0) target.direction = 'right';
		else if (target.xAccel < 0) target.direction = 'left';
	}

	function enforceMaxSpeed() {
		var sign = target.xAccel > 0 ? +1 : -1;
		target.xAccel = Math.min(target.maxSpeed, Math.abs(target.xAccel)) * sign;
	}

	function applyGravity() {
		target.yAccel += target.gravity;
	}

	function enforceStageBoundaries() {
		var p = getNextPosition();

		if (p.left < 0) {
			target.xAccel = 0;
			target.x = 0;
		}

		if (p.right > Menis.root.width){
			target.xAccel = 0;
			target.x = Menis.root.width - target.width;
		}

		if (p.bottom > Menis.root.height) {
			target.yAccel = 0;
			target.y = Menis.root.height - target.height;
			target.jumping = false;
		}
	}

	function handlePlatforms() {
		var nextPos = getNextPosition();

		for (var i = 0; i < Menis.root.platforms.length; i++) {
			var p = Menis.root.platforms[i];

			var isColliding =
				target.y + target.height <= p.y
				&& Menis.Collisions.rectanglesOverlaps(nextPos, p.getRectangle());

			if (isColliding) {
				target.yAccel = 0;
				target.y = p.y - target.height;
				target.jumping = false;
				break;
			}
		}
	}

	function enforceMaxYAccel() {
		target.yAccel = Math.min(target.yAccel, 100);
	} 

	function handleJumping() {
		if (!target.jumping && cmd(commands.jump)) {
			target.jumping = true;
			target.yAccel -= target.jumpPower;
		}
	}

	function handlePlatformLeaping() {
		if (!target.jumping && cmd(commands.leapFromPlatform)) {
			target.y += 2;
			target.jumping = true;
		}
	}

	function updatePosition() {
		target.x += target.xAccel;
		target.y += target.yAccel;
	}

	function getNextPosition() {
		return {
			left:   target.x + target.xAccel,
			top:    target.y + target.yAccel,
			right:  target.x + target.xAccel + target.width,
			bottom: target.y + target.yAccel + target.height
		};
	}
}

Menis.Game.Mechanics.BasicMechanicsUI = function BasicMechanicsUI() {

	var animations = {
		stand:   new Menis.SpritesheetAnimation("img_new/standing.png", 30, 48, { style: Menis.AnimationStyles.YOYO }),
		run:     new Menis.SpritesheetAnimation("img_new/walking.png", 34, 48, { style: Menis.AnimationStyles.YOYO }),
		jumping: new Menis.ImageAnimation("img_new/falling.png")
	}

	this.update = function (target) {
		var ui = target.ui;

		ui.x = target.x;
		ui.y = target.y;

		if (target.jumping) {
			ui.setAnimation(animations.jumping);
		}
		else if (target.xAccel !== 0) {
			ui.setAnimation(animations.run, true);
			var delayer = Math.abs(target.xAccel);
			ui.getAnimation().frameDelay = 5 - Math.floor(delayer / 5);
		}
		else {
			ui.setAnimation(animations.stand, true).frameDelay = 4;
		}

		ui.getAnimation().flipHorizontally = target.direction === 'left';
	};
}