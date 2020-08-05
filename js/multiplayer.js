
$("#create").on("click",createGame);
$("#connect").on("click",connectToRoom);

let ajaxCreateGame;
let ajaxConnect;
let gameID;
let requestBody;
let connected;

function createGame(){
    console.log("creating game...");
    ajaxCreateGame = $.ajax({
        method: "POST",
        url: "https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game",
        data: {name: "motiondew"}
       }).done(function(data){
            gameID = data.ID;
            console.log(gameID);
            connected = true;
            changeConnectionInfo();
       });
}

function connectToRoom(){

    console.log("connecting to room...");
    let roomNumber = $("#room-number").val();
    console.log(roomNumber);
    if(roomNumber !=="Room number goes here" || roomNumber !==""){
        $.ajax({
            method: "GET",
            url: `https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${roomNumber}`,
            success: function(data){
                gameID = data.ID;
                console.log(gameID);
                changeConnectionInfo();
                requestBody = data;
                connected = true;
                //++ 
            },
            error: function(data,status){
                console.log("ERROR"+status);
            }
        });
    }
}

setInterval(() => {
    if(connected === true){
        $.ajax({
            method: "GET",
            url: `https://chess.thrive-dev.bitstoneint.com/wp-json/chess-api/game/${gameID}`,
            success: function(data){
                gameID = data.ID;
                // console.log(gameID);
                requestBody = data;
                //++ 
                // console.log(requestBody.moves);
            },
            error: function(data,status){
                console.log("ERROR"+status);
            }
        });
    }
}, 1000);


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

