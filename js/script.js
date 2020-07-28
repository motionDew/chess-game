
let seconds = 1;

function generateBoard(){
    let container = document.createDocumentFragment();
    let chessboard = document.createElement("div");
    chessboard.className = "chessboard";
    
    let paddingflag = 0;
    let columnIndex=0;
    
    for(let i=0;i<64;i++){
        let chessbox = document.createElement("div");
        if( (i+paddingflag) % 2 === 0){
            chessbox.className = "checkbox white";
        }else{
            chessbox.className = "checkbox black";
        }
        chessbox.dataset.columnIndex= i%8;
        if(i%8 === 0){
            columnIndex = i/8;
        }
        chessbox.dataset.rowIndex= columnIndex;
        chessboard.appendChild(chessbox);
        
        if( (i+1)%8 === 0 ){
            if(paddingflag === 0 ){
                paddingflag = 1;
            }else{
                paddingflag = 0;
            }
        }
    }
    container.appendChild(chessboard);
    document.body.appendChild(container);
    return;
}

function countdown(){
    if(seconds !== 0){
        seconds--;
        headingCount.innerText = seconds;
    }else{
        document.body.removeChild(headingCount);
        clearInterval(startCounting);
        generateBoard();
        generateChessPiece();
    }
}

let startCounting = setInterval(countdown,1000);
let timerScreen;
let headingCount;

window.onload = function(){
    timerScreen = document.createDocumentFragment();
    headingCount = document.createElement("H1");
    headingCount.className = "counter";
    timerScreen.appendChild(headingCount);
    headingCount.innerText = seconds;
    document.body.appendChild(timerScreen);
}

var matrix = [];
for(var i=0; i<9; i++) {
    matrix[i] = [];
    for(var j=0; j<9; j++) {
        matrix[i][j] = undefined;
    }
}

matrix = 
[
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['♜','♞','♝','♚','♛','♝','♞','♜'],
]



function generateChessPiece(){   
    let chessboardDivs = Array.from(document.body.getElementsByClassName("checkbox"));
    chessboardDivs.forEach( el => 
        el.innerText =
            matrix[el.getAttribute("data-row-index")][el.getAttribute("data-column-index")]
             );
}

class ChessPiece{

}

