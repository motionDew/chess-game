let seconds = 0;
let blackPiecesObject;
let whitePiecesObject;

//Pieces look up table symbol
const symbolLUT = {
    king: '♚',
    queen: '♛',
    bishop: '♝',
    knight: '♞',
    rook: '♜',
    pawn: '♟'
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
    let board = new Board();
    board.init();
    console.log(board.boardState);
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
    }
}



class Coordinate{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class ChessPiece{
    constructor(symbol,rowIndex,columnIndex,color,status){
        if(new.target === ChessPiece){
            throw new TypeError("Cannot construct ChessPiece instances  directly!");
        }
        this.symbol = symbol;
        this.coordinate = new Coordinate(rowIndex,columnIndex);
        this.color = color;
        this.status = status;
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
            return 1;
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

}

class King extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("king",rowIndex,columnIndex,color,"alive");
    }
}
class Queen extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("queen",rowIndex,columnIndex,color,"alive");
    }
}
class Bishop extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("bishop",rowIndex,columnIndex,color,"alive");
    }
}
class Knight extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("knight",rowIndex,columnIndex,color,"alive");
    }
}
class Rook extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("rook",rowIndex,columnIndex,color,"alive");
    }
}
class Pawn extends ChessPiece{
    constructor(rowIndex,columnIndex,color){
        super("pawn",rowIndex,columnIndex,color,"alive");
    }
}



class Board {

    boardState = [];

    constructor(){

    }

    init(){
        for(let i=0;i<8;i++){
            this.boardState[i] = [];
            for(let j=0;j<8;j++){
                this.boardState[i][j] = 0;
            }
        }
        this.generatePieces();
        for(let key in blackPiecesObject){
            this.boardState[blackPiecesObject[key].coordinate.y][blackPiecesObject[key].coordinate.x] = blackPiecesObject[key];
        }
        for(let key in whitePiecesObject){
            this.boardState[whitePiecesObject[key].coordinate.y][whitePiecesObject[key].coordinate.x] = whitePiecesObject[key];
        }
    }

    generatePieces(){
        blackPiecesObject = {
            rookLeft: new Rook("0","0","black"),
            knightLeft: new Knight("1","0","black"),
            bishopLeft: new Bishop("2","0","black"),
            queen: new Queen("3","0","black"),
            king: new King("4","0","black"),
            bishopRight: new Bishop("5","0","black"),
            knightRight: new Knight("6","0","black"),
            rookRight: new Rook("7","0","black"),
            pawn1: new Pawn("0","1","black"),
            pawn2: new Pawn("1","1","black"),
            pawn3: new Pawn("2","1","black"),
            pawn4: new Pawn("3","1","black"),
            pawn5: new Pawn("4","1","black"),
            pawn6: new Pawn("5","1","black"),
            pawn7: new Pawn("6","1","black"),
            pawn8: new Pawn("7","1","black")
        }
        whitePiecesObject = {
            rookLeft: new Rook("0","7","white"),
            knightLeft: new Knight("1","7","white"),
            bishopLeft:new Bishop("2","7","white"),
            queen: new Queen("4","7","white"),
            king: new King("3","7","white"),
            bishopRight: new Bishop("5","7","white"),
            knightRight: new Knight("6","7","white"),
            rookRight: new Rook("7","7","white"),
            pawn1: new Pawn("0","6","white"),
            pawn2: new Pawn("1","6","white"),
            pawn3: new Pawn("2","6","white"),
            pawn4: new Pawn("3","6","white"),
            pawn5: new Pawn("4","6","white"),
            pawn6: new Pawn("5","6","white"),
            pawn7: new Pawn("6","6","white"),
            pawn8: new Pawn("7","6","white")
        }
    }
}

class Game{
    constructor(board){
        this.board = board;
    }

    start(){

    }
}


// EVENT LISTENERS
