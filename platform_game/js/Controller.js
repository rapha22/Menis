Menis.Util.ns("Menis.Game").Controller = function Controller(target) {
	var frameTriggers = [];
	var keyDownTriggers = [];
	var keyUpTriggers = [];

	target.controller = this;
	
	this.addFrameTrigger = function (keys, commandId) {
		frameTriggers.push({ keys: keys, commandId: commandId });
	};

	this.addKeyDownTrigger = function (keys, commandId) {
		keyDownTriggers.push({ keys: keys, commandId: commandId });
	};

	this.addKeyUpTrigger = function (keys, commandId) {
		keyUpTriggers.push({ keys: keys, commandId: commandId });
	};

	this.getCommands = function () { return commands; };
	this.reset = function () { commands = []; };


	this.update = function update() {
		gatherCommands(frameTriggers);
	};

	Menis.key.on(Menis.Events.KEY_DOWN, function () {
		gatherCommands(keyDownTriggers);
	});

	Menis.key.on(Menis.Events.KEY_UP, function () {
		gatherCommands(keyUpTriggers);
	});

	function gatherCommands(triggers) {
		target.commands = target.commands || [];
		for (var i = 0, l = triggers.length; i < l; i++) {
			if (Menis.key.isDown(triggers[i].keys)) {
				target.commands.push(triggers[i].commandId);
			}
		}
	}
};