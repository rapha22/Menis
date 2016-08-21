Menis.Game.Resources.add('img/plataform.png');

Menis.Game.Platform = function Platform(data) {

	this.ui = new Menis.Entity();
	this.ui.setAnimation(new Menis.ImageAnimation("img/plataform.png"));

	this.x      = data.x      || 0;
	this.y      = data.y      || 0;
	this.width  = data.width  || 0;
	this.height = data.height || 0;

	Menis.Game.Util.linkPosition(this, this.ui);
};