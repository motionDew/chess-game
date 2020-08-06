function app(gameType ="SINGLEPLAYER",teamColor = "white") {
    let game = new Board(gameType,teamColor);
    game.init();
    requestJokeAjax();
    return game;
}