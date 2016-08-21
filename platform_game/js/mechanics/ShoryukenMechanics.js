Menis.Game.Resouces.add('img/shoryuken.png');

Menis.Util.ns('Menis.Game.Mechanics').ShoryukenMechanics = function ShoryukenMechanics() {
	var isDoing = false;

	var anim = new Menis.SpritesheetAnimation("img/shoryuken.png", 100, 100, {
		actions: { 8: function (hero) { isDoing = false; hero.canChangeAnimation = true; } }
	});

	return { 
		execute: function (hero, heroUI) {
			if (!hero.jumping)
			{
				isDoing = false;
				return false;
			}

			if (Menis.key.isDown('S') && !isDoing)
			{
				isDoing = true;
				hero.canChangeAnimation = false;
				hero.jump();
				hero.setAnimation(anim);
			}
			else if (isDoing)
			{
				//Makes shoryuken destroy the enemies
				for (var i = 0; i < Menis.root.enemies.length; i++)
				{
					var en = Menis.root.enemies[i];
					if (hero.hitTest(en))
						en.hit = true;
				}
			}

			return true;
		}
	};
}