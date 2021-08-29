import Menis from '../../Menis/Menis.js';
import GameObject from './GameObject.js';
import BaseHeroState from './states/BaseHeroState.js';
import HadoukenState from './powers/HadoukenState.js';
import ShoryukenState from './powers/ShoryukenState.js';
import enforceScenarioBoundaries from './enforceScenarioBoundaries.js';

export default function Hero() {
	var self = Object.create(GameObject);

	game.objects.add(self);

	self.baseState = new BaseHeroState(self);
	self.states = [
		self.baseState,
		new HadoukenState(self),
		new ShoryukenState(self)
	];

	self.power = 0;
	self.direction = "right";
	self.frameDelay = 3;
	self.jumping = true;
	self.canMove = true;
	self.canJump = true;
	self.canChangeAnimation = true;
	self.friction = 0;

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
		self.state = getCurrentState();

		self.state.processBeforeCollision();

		self.x += self.xAccel;
		self.y += self.yAccel;

		enforceScenarioBoundaries(self);

		applyGravity();

		setDiretion();

		applyFriction(self.state.getFriction());

		self.state.setAnimation();
		self.graphs.getAnimation().flipHorizontally = self.direction === "left"; //If facing left, flip

		self.graphs.x = self.x;
		self.graphs.y = self.y;
	};

	function getCurrentState() {
		for (var i = 0, l = self.states.length; i < l; i++) {
			if (self.states[i].shouldApply())
				return self.states[i];
		}

		return self.baseState;
	}

	function applyGravity() {
		if (self.jumping) {			
			self.yAccel += 2; //Gravity

			if (Math.abs(self.yAccel) > 100)
				self.yAccel = self.yAccel < 0 ? -100 : 100;
		}
	}

	function applyFriction(friction) {
		if (self.jumping) friction = 1;
		if (self.xAccel > 0) self.xAccel = Math.max(self.xAccel - friction, 0);
		else if (self.xAccel < 0) self.xAccel = Math.min(self.xAccel + friction, 0);
	}

	function setDiretion() {
		if (self.xAccel > 0) self.direction = "right";
		else if (self.xAccel < 0) self.direction = "left";
	}

	self.getAnimation = self.graphs.getAnimation.bind(self.graphs);
	self.setAnimation = self.graphs.setAnimation.bind(self.graphs);

	function stopJumping()
	{
		self.yAccel = 0;
		self.jumping = false;
	}

	self.graphs.scale(1.5, 1.5);

	return self;
};