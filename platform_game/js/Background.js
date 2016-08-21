Menis.Game.Background = function Background (backgroundData) {
	this.ui = new Menis.Entity("background");
	this.ui.setAnimation(new Menis.ImageAnimation(backgroundData.imageUrl));
	return background; 
};