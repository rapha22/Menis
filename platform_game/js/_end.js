//Menis.debugMode = true;
Menis(document.getElementsByTagName('canvas')[0]);
Menis.renderer.setImageSmoothing(false);
window.game = new Game();
game.createGame();

Menis.start();

})(window);