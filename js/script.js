
let seconds = 0;

function generateBoard(){
    let container = document.createDocumentFragment();
    let chessboard = document.createElement("div");
    chessboard.className = "chessboard";
    
    let paddingflag = 0;
    let columnIndex=0;
    
    for(let i=0;i<64;i++){
        let chessbox = document.createElement("div");
        if( (i+paddingflag) % 2 === 0){
            chessbox.className = "chessbox white-square";
        }else{
            chessbox.className = "chessbox black-square";
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
        // generateChessPiece();
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



function generateBlackPieces(){   
    
}

function generateWhitePieces(){   
    
}

//Pieces look up table symbol

const symbolLUT = {
    king: '♚',
    queen: '♛',
    bishop: '♝',
    knight: '♞',
    rook: '♜',
    pawn: '♟'
}

class Coordinate{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class ChessPiece{
    constructor(symbol,rowIndex,columnIndex,color){
        if(new.target === ChessPiece){
            // throw new TypeError("Cannot construct ChessPiece instances  directly!");
        }
        this.symbol = symbol;
        this.coordinate = new Coordinate(rowIndex,columnIndex);
        this.color = color;
        this.putPiece(this.coordinate.x,this.coordinate.y);
    }

    getPosition(){
        return this.coordinate;
    }

    // Gets the div where the piece is placed.
    getContainerElement(){
        let container = Array.from(document.body.getElementsByClassName("chessbox"));
        let childContainer = container.find( box => box.dataset.columnIndex === this.coordinate.x && box.dataset.rowIndex === this.coordinate.y);
        return childContainer;
    }

    //Places the piece at the specified coordinates 
    putPiece(){
        let childContainer = this.getContainerElement();

        // check if in box is not another div;
        if(childContainer.children.length === 0){

        //create piece data;
        let pieceDiv = document.createElement("div");
        pieceDiv.classList.add(this.color);
        pieceDiv.dataset.color = this.color;
        pieceDiv.innerText = symbolLUT[this.symbol];

        childContainer.appendChild(pieceDiv);
        }else{
            console.log("Occupied!");
            return;
        }
    }

    //Changes coordinates, removes the current piece(div), and then places it at the changed coordinates.
    movePiece(rowIndex,columnIndex){
        this.removePiece();
        this.coordinate.x = rowIndex;
        this.coordinate.y = columnIndex;
        this.putPiece();
    }

    // Removes the div from the containing chessbox
    removePiece(){
        let currentContainer = this.getContainerElement();
        let piece = currentContainer.childNodes[0];
        currentContainer.removeChild(piece);
    }

    // get rowIndex(){
    //     return this._rowIndex;
    // }

    // set rowIndex(value){
    //     this._rowIndex = value;
    // }

    // get columnIndex(){
    //     return this._columnIndex;
    // }

    // set columnIndex(value){
    //     this._columnIndex = value;
    // }

    // changeCoordinate(rowIndex,columnIndex){
    //     this.coordinate.x = rowIndex;
    //     this.coordinate.y = columnIndex;
    // }

}

class King extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("king",rowIndex,columnIndex,color);
    }
}
class Queen extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("queen",rowIndex,columnIndex,color);
    }
}
class Bishop extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("bishop",rowIndex,columnIndex,color);
    }
}
class Knight extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("knight",rowIndex,columnIndex,color);
    }
}
class Rook extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("rook",rowIndex,columnIndex,color);
    }
}
class Pawn extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("pawn",rowIndex,columnIndex,color);
    }
}


class BlackSide {
    constructor(){
        this.score = 0;
        // piece
    }
}
