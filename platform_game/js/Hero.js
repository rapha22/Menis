Menis.Game.Hero = function () {
	var self = this;

	Menis.Game.GameObject(self);

	self.x = 0;
	self.y = 0;
	self.width = 45;
	self.height = 72;

	self.commands = [];
	
	self.ui = new Menis.Entity('hero');
	self.ui.scale(1.5, 1.5);
	$game.layers.middle.addChild(self.ui);

	self.mechanics = new Menis.Game.Mechanics.BasicMechanics(self);

	var mechanics = [
		new Menis.Game.Mechanics.HadoukenMechanics(self),
		new Menis.Game.Mechanics.ShoryukenMechanics(self)
	];

	self.update = function () {

		/*
		var currentMechanic = null;
		for (var i = 0, l = mechanics.length; i < l; i++) {
			var m = mechanics[i];
			var result = m.execute();

			if (!result) continue;

			currentMechanic = m;
			
			if (result.exclusive) break;
		}
		*/
		self.mechanics.execute();
		self.commands = [];
	};
};