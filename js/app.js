import {Board} from './board.js';
import {requestJokeAjax} from './joke.js'
 
export function app(gameType ="SINGLEPLAYER",teamColor = "white") {
    console.log("Game type:"+gameType);
    console.log("Player color:"+teamColor);
    let game = new Board(gameType,teamColor);
    game.init();
    requestJokeAjax();
    return game;
}

export function appWrapper(e){
    app();
}