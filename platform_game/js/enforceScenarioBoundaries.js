import Menis from '../../Menis/Menis.js';

export default function enforceScenarioBoundaries(target) {
	var groundY = null;

	if (target.y + target.height >= Menis.root.height) {
		groundY = Menis.root.height;
		stopJumping();
	}
	else
	{
		//Verifica se está colidindo com alguma plataforma
		for (var i = 0; i < game.platforms.length; i++) {
			var p = game.platforms[i];

			var nextMove = {
				left:   target.x + target.xAccel,
				top:    target.y + target.yAccel,
				right:  target.x + target.xAccel + target.width,
				bottom: target.y + target.yAccel + target.height
			};

			if (Menis.Collisions.rectanglesOverlapsX(nextMove, p.getRectangle())) {
				if (target.y + target.height <= p.y && Menis.Collisions.rectanglesOverlapsY(nextMove, p.getRectangle())) {
					groundY = p.y;
					stopJumping();
					break;
				}
			}
		}

		if (groundY === null) //If we don't have a plataform to stand, then we are jumping/falling
			target.jumping = true;
	}

	if (target.x < 0) {
		target.x = 0;
		target.xAccel = 0;
	}
	else if (target.x + target.width > Menis.root.width) {
		target.x = Menis.root.width - target.width - 1;
		target.xAccel = 0;
	}

	if (groundY !== null) target.y = groundY - target.height;

	
	function stopJumping() {
		target.yAccel = 0;
		target.jumping = false;
	}
};