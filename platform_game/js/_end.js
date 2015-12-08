//Menis.debugMode = true;
Menis(document.getElementsByTagName('canvas')[0]);
Menis.renderer.setImageSmoothing(false);
window.game = new Menis.Game().createGame();

Menis.start();

})(window);