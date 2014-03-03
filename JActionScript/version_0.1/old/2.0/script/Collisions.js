Collisions = {};

Collisions.isInRange = function(value, start, end)
{
	return value >= start && value <= end;
}

Collisions.rectanglesOverlaps = function(a, b)
{
	var overlapsAX 		= true;
	overlapsAX 			&= this.isInRange(a.x, b.x, b.x + b.width);
	overlapsAX 			&= this.isInRange(a.y, b.y, b.y + b.height);
	
	var overlapsAWidth 	= true;
	overlapsAWidth 		&= this.isInRange(a.x + a.width, b.x, b.x + b.width);
	overlapsAWidth 		&= this.isInRange(a.y + a.height, b.y, b.y + b.height);

	var overlapsBX 		= true;
	overlapsBX 			&= this.isInRange(b.x, a.x, a.x + a.width);
	overlapsBX 			&= this.isInRange(b.y, a.y, a.y + a.height);
	
	var overlapsBWidth	= true;
	overlapsBWidth 		&= this.isInRange(b.x + b.width, a.x, a.x + a.width);
	overlapsBWidth 		&= this.isInRange(b.y + b.height, a.y, a.y + a.height);
	
	return overlapsAX || overlapsAWidth || overlapsBX || overlapsBWidth;
}