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


// Pieces classes

class ChessPiece {
    constructor(color) {
        if (new.target === ChessPiece) {
            throw new TypeError("Cannot construct ChessPiece instances  directly!");
        }
        this.color = color;
    }

    get color() {
        return this._color;
    }
    set color(value) {
        this._color = value;
    }

    //return
    getSuggestedMoves(){
        return;
    }
    // Gets the div where the piece is placed.
    getContainerElement() {
        let container = Array.from(document.body.getElementsByClassName("chessbox"));
        let childContainer = container.find(box => box.dataset.columnIndex === this.coordinate.x && box.dataset.rowIndex === this.coordinate.y);
        return childContainer;
    }
}

class King extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♚";
    }
    getSuggestedMoves(){

    }
}
class Queen extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♛";
    }
}
class Bishop extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♝";
    }
}
class Knight extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♞";
    }
}
class Rook extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♜";
    }
}
class Pawn extends ChessPiece {
    constructor(color) {
        super(color);
    }

    get symbol() {
        return "♟";
    }

    getPieceDirection(colorValue){
        if(colorValue === "black"){
            return 1;
        }
        return -1;
    }

    //return a list of grid indexes where the piece can move;
    getSuggestedMoves(chesstableState,fromRow,fromCol){

        let suggestedMoves = {
            legalMoves: [],
            attackMoves: [],    
        };
        let chessPiece = chesstableState[fromRow][fromCol];
        let pieceDirection = this.getPieceDirection(chessPiece.color);

        if((fromRow + pieceDirection) >= 0 && (fromRow + pieceDirection) <=7){
            if(chesstableState[fromRow + pieceDirection][fromCol] === "0"){
                suggestedMoves.legalMoves.push([fromRow + pieceDirection,fromCol]);
            }else{
                suggestedMoves.attackMoves.push([fromRow+pieceDirection,fromCol - 1]);
                suggestedMoves.attackMoves.push([fromRow + pieceDirection,fromCol + 1]);
            }
        }
        return suggestedMoves;
        
    }

}


// Board drawing

class Board {

    get initialState() {
        return [
            [new Rook('black'), new Knight('black'), new Bishop('black'), new Queen('black'), new King('black'), new Bishop('black'), new Knight('black'), new Rook('black')],
            [new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black'), new Pawn('black')],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            [new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white'), new Pawn('white')],
            [new Rook('white'), new Knight('white'), new Bishop('white'), new Queen('white'), new King('white'), new Bishop('white'), new Knight('white'), new Rook('white')]
        ]
    }
    constructor() {
        this.currentState = this.initialState;
    }

    //Variables
    get fromRow() {
        return this._fromRow;
    }
    set fromRow(value){
        this._fromRow = value;
    }
    get fromColumn() {
        return this._fromColumn;
    }
    set fromColumn(value){
        this._fromColumn = value;
    }
    get toRow() {
        return this._toRow;
    }
    set toRow(value) {
        this._toRow = value;
    }
    get toColumn() {
        return this._toColumn;
    }
    set toColumn(value) {
        this._toColumn = value;
    }

    draw() {
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = document.createElement("div");

                if (this.currentState[i][j] !== "0") {
                    piece.innerText = this.currentState[i][j].symbol;
                    piece.className = this.currentState[i][j].color;
                    //this finds the div that has data-column-index === j and data-row-index === i
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.appendChild(piece);
                } else {
                    let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                    chessbox.innerHTML = "";
                }
            }
        }
    }
    clear() {
        let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let chessbox = chessboxArray.find(element => element.dataset.rowIndex === i.toString() && element.dataset.columnIndex === j.toString());
                chessbox.innerHTML = "";
            }
        }
    }

    init() {

    }

    hasSquareSelected() {
        return (typeof this._fromRow !== 'undefined') && typeof this._fromColumn !== 'undefined';
    }

    onSquareClick(event) {

        const chessbox = event.currentTarget;
        const row = parseInt(chessbox.dataset.rowIndex);
        const column = parseInt(chessbox.dataset.columnIndex);
        const currentChessPiece = this.currentState[row][column];
        let chessboxDivArray = helper.getChessboxesAsArray();
        
        if (!this.hasSquareSelected()) {
            
            chessbox.classList.add("selected");
            this.fromRow = row;
            this.fromColumn = column;

            
            let suggestedMoves = currentChessPiece.getSuggestedMoves(this.currentState,this.fromRow,this.fromColumn);
            console.log(suggestedMoves);

            //draw suggestions

            //helper.getChessboxesAsArrayWithConstraint gets all DIVS that have indexes(row,column) in the specified array that looks like [[row1,col1],[row2,col2],..]
            //for each element suggest/attack class name is added
            helper.getChessboxesAsArrayWithConstraint(suggestedMoves.legalMoves).forEach( element => element.classList.add("suggest"));
            helper.getChessboxesAsArrayWithConstraint(suggestedMoves.attackMoves).forEach( element => element.classList.add("attack"));   

            //Pawn game mechanics:
            // check if chessbox is corespondig to a Pawn
            if (currentChessPiece instanceof Pawn) {
                //Check the colour in order to make a move suggestion
                // if (currentChessPiece.color === "white") { 
                //     let chessboxArray = helper.getChessboxesAsArray();
                //     //filter the chessbox so only the legal suggestions remain available
                //     //Decide if next suggestion is an Attack or a Move
                //     if (this.currentState[this.fromRow - 1][this.fromColumn] === "0") {
                //         let possibleMoves = chessboxArray.filter(element => element.dataset.rowIndex === (row - 1).toString() && element.dataset.columnIndex === chessbox.dataset.columnIndex);
                //         //draw the chessbox suggestion in green
                //         possibleMoves.forEach(element => element.classList.add("suggest"));
                //     } else {
                //         let attackSuggestins = chessboxArray.filter(element =>
                //             (element.dataset.rowIndex === (row - 1).toString() && element.dataset.columnIndex === (column - 1).toString())
                //             ||
                //             (element.dataset.rowIndex === (row - 1).toString() && element.dataset.columnIndex === (column + 1).toString()));
                //         attackSuggestins.forEach(element => element.classList.add("attack"));
                //     }
                // } else {
                //     let chessboxArray = Array.from(document.getElementsByClassName("chessbox"));
                //     if (this.currentState[this.fromRow+1][this.fromColumn] === "0") {
                //         let possibleMoves = chessboxArray.filter(element => element.dataset.rowIndex === (row + 1).toString() && element.dataset.columnIndex === chessbox.dataset.columnIndex);
                //         //draw the chessbox suggestion in green
                //         possibleMoves.forEach(element => element.classList.add("suggest"));
                //     } else {
                //         let attackSuggestins = chessboxArray.filter(element =>
                //             (element.dataset.rowIndex === (row + 1).toString() && element.dataset.columnIndex === (column - 1).toString())
                //             ||
                //             (element.dataset.rowIndex === (row + 1).toString() && element.dataset.columnIndex === (column + 1).toString()));
                //         attackSuggestins.forEach(element => element.classList.add("attack"));
                //     }
                // }
            }

        } else {
            chessbox.classList.add("selected");
            this.toRow = row;
            this.toColumn = column;
            let lastSelectedPiece = this.currentState[this.fromRow][this.fromColumn];
            let secondSelectedPiece =this.currentState[this.toRow][this.toColumn];

            //Pawn game mecanics:
            //check if LAST SELECTED element was a Pawn
            if (lastSelectedPiece instanceof Pawn) {
                //Check the color
                if (lastSelectedPiece.color === "black") {
                    //Decide what type of move Pawn will do: Attack or Move
                    if (this.currentState[this.toRow][this.toColumn] === "0") {
                        //move rule
                        //check if distance between LAST SELECTED row index and CURRENT SELECTED row index is 1
                        //in less words check if it can move forward acording to their move direction
                        if ((this.toRow - this.fromRow) !== 1 || this.toColumn !== this.fromColumn) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    } else {
                        //attack rule
                        //if _to position is in fron of the Pawn or distance on the vertical axis is greater than 1 than ilegal
                        if (this.toColumn === this.fromColumn || (this.toRow - this.fromRow) !== 1) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    }
                }
                else {
                    //white Pawn
                    if (this.currentState[this.toRow][this.toColumn] === "0") {
                        //move rule
                        if ((this.fromRow - this.toRow) !== 1 || this.toColumn !== this.fromColumn) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    } else {
                        //attack rule
                        if (this.toColumn === this.fromColumn || (this.fromRow - this.toRow) !== 1) {
                            console.log("ilegal move!");
                        } else {
                            //Change position
                            this.currentState[this.toRow][this.toColumn] = lastSelectedPiece; //duplicate;
                            this.currentState[this.fromRow][this.fromColumn] = "0"; //duplicate
                        }
                    }
                }
            }

            this.fromRow = undefined;
            this.fromColumn = undefined;
            this.toRow = undefined;
            this.toRow = undefined;
            this.clear();
            this.draw();

            let selectedChessboxes = Array.from(document.getElementsByClassName("selected"));
            selectedChessboxes.forEach(element => element.classList.remove("selected"));

            let suggestedChessboxes = Array.from(document.getElementsByClassName("chessbox"));
            suggestedChessboxes.forEach(element => element.classList.remove("suggest"));

            let attackChessboxes = Array.from(document.getElementsByClassName("chessbox"));
            suggestedChessboxes.forEach(element => element.classList.remove("attack"));

        }
    }
    generateBoard() {
        let container = document.createDocumentFragment();
        let chessboard = document.createElement("div");
        chessboard.className = "chessboard";

        let paddingflag = 0;
        let columnIndex = 0;


        //TODO: refactor so this uses 2 fors
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
            chessbox.addEventListener("click", this.onSquareClick.bind(this));

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
    }
}

function app() {

    let game = new Board();
    game.generateBoard();
    game.draw();

}

let helper = {
    getChessboxesAsArray: function(){
        return Array.from(document.getElementsByClassName("chessbox"));
    },
    getChessboxFromIndexes: function(row,column){
        if(Number.isInteger(row) || Number.isInteger(column)){
            row = row.toString();
            column = column.toString();
        }
        return this.getChessboxesAsArray().find(element => element.dataset.rowIndex === row && element.dataset.columnIndex === column);
    },
    getChessboxesAsArrayWithConstraint: function(indexArray){
        let divArray = [];
        let allDivs = this.getChessboxesAsArray();
        indexArray.forEach(element => divArray.push(this.getChessboxFromIndexes(element[0],element[1])));
        return divArray;
    }
}