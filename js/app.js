function app() {
    let game = new Board();
    game.init();
    requestJokeAjax();
}