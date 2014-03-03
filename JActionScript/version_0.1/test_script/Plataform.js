function Plataform(x, y)
{
	DisplayObject.call(this);
	
	this.setAnimation(new ImageAnimation("img/plataform.png"));
	
	this.x = x || 0;
	this.y = y || 0;
}