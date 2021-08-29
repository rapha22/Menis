import Menis from '../../../Menis/Menis.js';

export default function BaseHeroState(hero) {
	var speed = 2;

	var animations = {
		stand   : Menis.sprite("img_new/standing.png", 30, 48, { style: Menis.AnimationStyles.YOYO }),
		run     : Menis.sprite("img_new/walking.png", 34, 48, { style: Menis.AnimationStyles.YOYO }),
		jumping : Menis.image("img_new/falling.png")
	};

	this.shouldApply = function () {
		return false;
	}

	this.processBeforeCollision = function () {
		if (Menis.key.isDown(Menis.key.RIGHT)) hero.xAccel += speed;
		if (Menis.key.isDown(Menis.key.LEFT)) hero.xAccel -= speed;

		if (Menis.key.isDown(Menis.key.DOWN, "D") && !hero.jumping) {
			leapFromPlatform();
		}
		else if (Menis.key.isDown("D") && !hero.jumping) {
			jump();
		}
	};

	this.setAnimation = function () {
		if (hero.jumping) {
			hero.setAnimation(animations.jumping, true);
		}
		else {
			if (hero.xAccel != 0) {
				hero.setAnimation(animations.run, true);
				var delayer = Math.abs(hero.xAccel);
				hero.getAnimation().frameDelay = (delayer === 0) ? 5 : Math.floor(speed / Math.max(delayer / 5, 1));
			}
			else {
				hero.setAnimation(animations.stand, true).frameDelay = 4;
			}
		}
	};

	this.getFriction = function () {
		return 1;
	}

	function jump(result) {
		if (!hero.canJump) return;
		hero.yAccel = -20;
	}

	function leapFromPlatform() {
		hero.y += 2;
	}
};