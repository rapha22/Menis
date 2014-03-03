Plataform = Menis.Entity.specialize(function (x, y)
{
	this.animation = new Menis.ImageAnimation("platform_game/img/plataform.png");

	this.x = x || 0;
	this.y = y || 0;
});