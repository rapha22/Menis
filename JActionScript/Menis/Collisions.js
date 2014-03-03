Menis.Collisions = {};

Menis.Collisions.isInRange = function (value, start, end)
{
	return value >= start && value <= end;
}

Menis.Collisions.rectanglesOverlaps = function (a, b)
{
	var overlapsAX 	= false;
	overlapsAX 		|= this.isInRange(a.x, b.x, b.x + b.width);
	overlapsAX 		|= this.isInRange(a.x + a.width, b.x, b.x + b.width);
	
	var overlapsAY 	= false;
	overlapsAY 		|= this.isInRange(a.y, b.y, b.y + b.height);
	overlapsAY 		|= this.isInRange(a.y + a.height, b.y, b.y + b.height);

	var overlapsBX 	= false;
	overlapsBX 		|= this.isInRange(b.x, a.x, a.x + a.width);
	overlapsBX 		|= this.isInRange(b.x + b.width, a.x, a.x + a.width);
	
	var overlapsBY	= true;
	overlapsBY 	|= this.isInRange(b.y, a.y, a.y + a.height);
	overlapsBY 	|= this.isInRange(b.y + b.height, a.y, a.y + a.height);
	
	return overlapsAX && overlapsAY && overlapsBX && overlapsBY;
}

Menis.Collisions.rectanglesOverlapsX = function (a, b)
{
	return this.isInRange(a.x, b.x, b.x + b.width) || this.isInRange(a.x + a.width, b.x, b.x + b.width);
}

Menis.Collisions.rectanglesOverlapsY = function (a, b)
{
	return this.isInRange(a.y, b.y, b.y + b.height) || this.isInRange(a.y + a.height, b.y, b.y + b.height);
}