var Platform = Menis.Entity.specialize(function (x, y)
{
	this.setAnimation(new Menis.ImageAnimation("img/plataform.png"));

	this.x = x || 0;
	this.y = y || 0;

	Level.map({ left: x, top: y, right: x + 200, bottom: y + 10 });
});