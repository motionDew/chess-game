import {changeConnectionInfo} from './global.js';
import {app} from './app.js';

$("#create").on("click",createGame);
$("#connect").on("click",connectToRoom);

//Declared in case we need to make the request without using the buttons
let ajaxCreateGame;
let ajaxConnect;
export let gameID;
export let moves = {};
export let movesLenght = 0;
//Flag that is used to check if the game needs to make GET requests for multiplayer games;
let connected;


//createGame makes a POST request that creates a new game with the moves list empty and a new unique game id;
// function createGame(){
//     console.log("creating game...");
//     ajaxCreateGame = $.ajax({
//         method: "POST",
//         url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game",
//         data: {name: "motiondew"}
//        }).done(function(data){
//             gameID = data.ID;   
//             changeConnectionInfo(); // erases Connect button, room number input and create game button;
//             app("MULTIPLAYER","white"); // starts an instance of class Board, assigning the multiplayer game type and white team color for the player;
//             connected = true; //used to allow get requests if the game type is multiplayer, set above, the game can't make requests if you're in a singleplayer game;
//        });
// }

//fetch api
async function createGame(gameName = 'motiondew new game' ){
    
    const response = fetch('https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: gameName})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        gameID = data.ID;   
        let teamColor = $("input[type=\"radio\"]:checked").val();
        app("MULTIPLAYER",teamColor); // starts an instance of class Board, assigning the multiplayer game type and white team color for the player;
        changeConnectionInfo(); // erases Connect button, room number input and create game button;
        connected = true; //used to allow get requests if the game type is multiplayer, set above, the game can't make requests if you're in a singleplayer game;
    })

}

// function connectToRoom(){
//     console.log("connecting to room...");
//     let roomNumber = $("#room-number").val();
//     console.log(roomNumber);
//     if(roomNumber !=="Room number goes here" || roomNumber !==""){
//         $.ajax({
//             method: "GET",
//             url: `https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${roomNumber}`,
//             success: function(data){
//                 gameID = data.ID;
//                 changeConnectionInfo(); // erases Connect button, room number input and create game button
//                 connected = true;   
//                 app("MULTIPLAYER","black"); //same as above, assigns multiplayer game type and black team color for the second player;
//             },
//             error: function(data,status){
//                 console.log("ERROR"+status);
//             }
//         });
//     }
// }

function connectToRoom(){
    console.log("connecting to room...");
    let roomNumber = $("#room-number").val();
    if(roomNumber !=="Room number goes here" || roomNumber !==""){
        fetch(`https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${roomNumber}`)
        .then( response => response.json())
        .then( data => {
            gameID = data.ID;
            changeConnectionInfo(); // erases Connect button, room number input and create game button
            connected = true;   
            let teamColor = $("input[type=\"radio\"]:checked").val();
            app("MULTIPLAYER",teamColor); //same as above, assigns multiplayer game type and black team color for the second player;
        }); 
    }
}

/*
*   If connected flag is true, makes a GET request to take the moves from the backend for the game
*/


/// FETCH 

// setInterval(() => {
//     if(connected === true){
//         $.ajax({
//             method: "GET",
//             url: `https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${gameID}`,
//             success: function(data){
//                 gameID = data.ID;
//                 moves = data.moves;
//                 // console.log(data);

//                 $(document).trigger("sendData",data); //send data from API to the Board instance, in order to change pieces/turns; @param data, not used currently
//             },
//             error: function(data,status){
//                 console.log("ERROR"+status);
//             }
//         });
//     }
// }, 1000);

setInterval(() => {
    if(connected === true){
        fetch(`https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${gameID}`)
        .then(response => response.json())
        .then( data =>{
            gameID = data.ID;
            moves = data.moves;
            $(document).trigger("sendData",data); //send data from API to the Board instance, in order to change pieces/turns; @param data, not used currently
        });
    }
    
}, 1000);


// var movesProxy = new Proxy(moves, {
//   set: function (target, key, value) {
//       console.log(`${key} set to ${value}`);
//       target[key] = value;
//       return true;
//   }
// });


//{
//     "from": {
//         "x": "6",
//         "y": "1"
//     },
//     "to": {
//         "x": "4",
//         "y": "1"
//     },
//     "by": "WHITE"
// }

