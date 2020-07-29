let seconds = 3;
let timerScreen;
let headingCount;


//Pieces look up table symbol
const pieces = {
    king: '♚',
    queen: '♛',
    bishop: '♝',
    knight: '♞',
    rook: '♜',
    pawn: '♟'
}

class ChessPiece {
    constructor(team) {
        if (new.target === ChessPiece) {
            throw new TypeError("Cannot construct ChessPiece instances  directly!");
        }
        this.team = team;
    }

    // Gets the div where the piece is placed.
    getContainerElement() {
        let container = Array.from(document.body.getElementsByClassName("chessbox"));
        let childContainer = container.find(box => box.dataset.columnIndex === this.coordinate.x && box.dataset.rowIndex === this.coordinate.y);
        return childContainer;
    }
    
    // Removes the div from the containing chessbox
    // removePiece() {
    //     let currentContainer = this.getContainerElement();
    //     let piece = currentContainer.childNodes[0];
    //     currentContainer.removeChild(piece);
    // }

}

class King extends ChessPiece {

    // static get symbol() {
    //     return 'king'
    // }

    // constructor(rowIndex, columnIndex, color) {
    //     super(rowIndex, columnIndex, color);

    //     this.symbol = 'king'
    // }

    constructor(){

    }

}
class Queen extends ChessPiece {
    constructor(rowIndex, columnIndex, color) {
        super("queen", rowIndex, columnIndex, color, "alive");
    }
}
class Bishop extends ChessPiece {
    constructor(rowIndex, columnIndex, color) {
        super("bishop", rowIndex, columnIndex, color, "alive");
    }
}
class Knight extends ChessPiece {
    constructor(rowIndex, columnIndex, color) {
        super("knight", rowIndex, columnIndex, color, "alive");
    }
}
class Rook extends ChessPiece {
    constructor(rowIndex, columnIndex, color) {
        super("rook", rowIndex, columnIndex, color, "alive");
    }
}
class Pawn extends ChessPiece {
    constructor(rowIndex, columnIndex, color) {
        super("pawn", rowIndex, columnIndex, color, "alive");
    }
}

class Board1 {

    static get initialState() {
        return [
            ['R', 'H', 'WB'],
            ['P'],
            [null, null]
        ]
    }

    boardState = [];

    constructor(state = Board.initialState) {

        this.currentState = state;

        this.init()
    }

    init() {
        for (let i = 0; i < 8; i++) {
            this.boardState[i] = [];
            for (let j = 0; j < 8; j++) {
                this.boardState[i][j] = 0;
            }
        }
        this.generatePieces();
        for (let key in blackPiecesObject) {
            this.boardState[blackPiecesObject[key].coordinate.y][blackPiecesObject[key].coordinate.x] = blackPiecesObject[key];
        }
        for (let key in whitePiecesObject) {
            this.boardState[whitePiecesObject[key].coordinate.y][whitePiecesObject[key].coordinate.x] = whitePiecesObject[key];
        }
    }

    generatePieces() {
        blackPiecesObject = {
            rookLeft: new Rook("0", "0", "black"),
            knightLeft: new Knight("1", "0", "black"),
            bishopLeft: new Bishop("2", "0", "black"),
            queen: new Queen("3", "0", "black"),
            king: new King("4", "0", "black"),
            bishopRight: new Bishop("5", "0", "black"),
            knightRight: new Knight("6", "0", "black"),
            rookRight: new Rook("7", "0", "black"),
            pawn1: new Pawn("0", "1", "black"),
            pawn2: new Pawn("1", "1", "black"),
            pawn3: new Pawn("2", "1", "black"),
            pawn4: new Pawn("3", "1", "black"),
            pawn5: new Pawn("4", "1", "black"),
            pawn6: new Pawn("5", "1", "black"),
            pawn7: new Pawn("6", "1", "black"),
            pawn8: new Pawn("7", "1", "black")
        }
        whitePiecesObject = {
            rookLeft: new Rook("0", "7", "white"),
            knightLeft: new Knight("1", "7", "white"),
            bishopLeft: new Bishop("2", "7", "white"),
            queen: new Queen("4", "7", "white"),
            king: new King("3", "7", "white"),
            bishopRight: new Bishop("5", "7", "white"),
            knightRight: new Knight("6", "7", "white"),
            rookRight: new Rook("7", "7", "white"),
            pawn1: new Pawn("0", "6", "white"),
            pawn2: new Pawn("1", "6", "white"),
            pawn3: new Pawn("2", "6", "white"),
            pawn4: new Pawn("3", "6", "white"),
            pawn5: new Pawn("4", "6", "white"),
            pawn6: new Pawn("5", "6", "white"),
            pawn7: new Pawn("6", "6", "white"),
            pawn8: new Pawn("7", "6", "white")
        }
    }
}
// class Game{

//     constructor(board){
//         this.board = board;
//     }

//     start(){
//         this.generateBoard();
//     }

//     generateBoard(){
//         let container = document.createDocumentFragment();
//         let chessboard = document.createElement("div");
//         chessboard.className = "chessboard";

//         let paddingflag = 0;
//         let columnIndex=0;

//         for(let i=0;i<64;i++){
//             let chessbox = document.createElement("div");
//             if( (i+paddingflag) % 2 === 0){
//                 chessbox.className = "chessbox white-square";
//             }else{
//                 chessbox.className = "chessbox black-square";
//             }
//             chessbox.dataset.columnIndex= i%8;
//             if(i%8 === 0){
//                 columnIndex = i/8;
//             }
//             chessbox.dataset.rowIndex= columnIndex;
//             chessboard.appendChild(chessbox);

//             if( (i+1)%8 === 0 ){
//                 if(paddingflag === 0 ){
//                     paddingflag = 1;
//                 }else{
//                     paddingflag = 0;
//                 }
//             }
//         }
//         container.appendChild(chessboard);
//         document.body.appendChild(container);
//         let board = new Board();
//         board.init();
//         console.log(board.boardState);
//         return;
//     }

//     // countdown(){
//     //     if(seconds !== 0){
//     //         seconds--;
//     //         headingCount.innerText = seconds;
//     //     }else{
//     //         document.body.removeChild(headingCount);
//     //         clearInterval(startCounter);
//     //         generateBoard();
//     //     }
//     // }

// }


// EVENT LISTENERS

// 


class Board {

    get initialState() {
        return [
            ['LR', 'LK', 'LB', 'Q', 'K', 'RK', 'KB', 'KR'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['LR', 'LK', 'LB', 'K', 'Q', 'RK', 'KB', 'KR']
        ]
    }
    constructor() {
        this.currentState = this.initialState;
    }

    //Variables
    get from(){
        return this._from;
    }
    set from(value){
        this._from = value;
    }
    get to(){
        return this._to;
    }
    set to(value){
        this._to = value;
    }

    draw() {
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                let piece = document.createElement("div");

                if(this.currentState[i][j] !== "0"){
                    piece.innerText = this.currentState[i][j];
                    //this finds the div that has data-column-index === j and data-row-index === i
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.appendChild(piece);
                }else{
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.innerHTML="";
                }
            }
        }
    }
    clear(){
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.innerHTML="";
                }
            }
    }

    init() {

    }
    generateBoard() {
        let container = document.createDocumentFragment();
        let chessboard = document.createElement("div");
        chessboard.className = "chessboard";

        let paddingflag = 0;
        let columnIndex = 0;

        for (let i = 0; i < 64; i++) {

            let chessbox = document.createElement("div");

            if ((i + paddingflag) % 2 === 0) {
                chessbox.className = "chessbox white-square";
            } else {
                chessbox.className = "chessbox black-square";
            }

            //fields given
            chessbox.dataset.columnIndex = i % 8;
            if (i % 8 === 0) {
                columnIndex = i / 8;
            }
            chessbox.dataset.rowIndex = columnIndex;
            chessbox.addEventListener("click", () =>{
                if(this._from === undefined){
                    chessbox.classList.add("selected");
                    this._from = [parseInt(chessbox.dataset.rowIndex),parseInt(chessbox.dataset.columnIndex)];
                    console.log(this._from);
                }else if(this._from !== undefined){
                    chessbox.classList.add("selected");
                    this._to = [parseInt(chessbox.dataset.rowIndex),parseInt(chessbox.dataset.columnIndex)];
                    console.log("to:"+this._to);
                    console.log("new from: "+ this._from);
                    this.currentState[this._to[0]][this._to[1]] = this.currentState[this._from[0]][this._from[1]];
                    this.currentState[this._from[0]][this._from[1]] = "0";
                    this._from = undefined;
                    this._to = undefined;
                    this.clear();
                    this.draw();
                    
                    let selectedChessboxes = Array.from(document.getElementsByClassName("selected"));
                    selectedChessboxes.forEach(element => element.classList.remove("selected"));
                }
            });

            chessboard.appendChild(chessbox);

            if ((i + 1) % 8 === 0) {
                if (paddingflag === 0) {
                    paddingflag = 1;
                } else {
                    paddingflag = 0;
                }
            }
        }
        container.appendChild(chessboard);
        document.body.appendChild(container);
        // console.log(curre);
        return;
    }
}

function app() {

    let game = new Board();
    game.generateBoard();
    game.draw();

}


//event listeners
